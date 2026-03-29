import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./MyOrders.css";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-backdrop">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="confirm-btn-ok" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}

function InvoiceModal({ order, onClose, onExport }) {
  return (
    <div className="confirm-backdrop" onClick={onClose}>
      <div className="invoice-modal" onClick={e => e.stopPropagation()}>
        <div className="invoice-header">
          <h3>🧾 Hóa đơn mua hàng</h3>
          <button className="invoice-close" onClick={onClose}>✕</button>
        </div>
        <div className="invoice-info">
          <p><strong>Mã đơn:</strong> #{order.id}</p>
          <p><strong>Ngày mua:</strong> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
          <p><strong>Thanh toán:</strong> {order.paymentMethod === "COD" ? "Khi nhận hàng" : "Chuyển khoản"}</p>
          {order.shippingAddress && <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>}
        </div>
        <table className="invoice-table">
          <thead>
            <tr><th>STT</th><th>Tên sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.price?.toLocaleString()} ₫</td>
                <td>{(item.price * item.quantity).toLocaleString()} ₫</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4"><strong>Tổng cộng</strong></td>
              <td><strong>{order.totalAmount?.toLocaleString()} ₫</strong></td>
            </tr>
          </tfoot>
        </table>
        <div className="invoice-actions">
          <button className="orders-btn-primary" onClick={() => onExport(order)}>📥 Xuất Excel</button>
        </div>
      </div>
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const loadOrders = () => {
    api.get("/cart/orders")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadOrders();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const confirm = (message, onConfirm) => setDialog({ message, onConfirm });

  const exportExcel = (order) => {
    const headerRows = [
      ["Mã đơn: #" + order.id + "  |  Ngày: " + new Date(order.createdAt).toLocaleDateString("vi-VN")],
      ["Địa chỉ: " + (order.shippingAddress || "Không có")],
      [],
      ["STT", "Tên sản phẩm", "Số lượng", "Đơn giá (đ)", "Thành tiền (đ)"],
    ];
    order.items.forEach((item, i) => {
      headerRows.push([i + 1, item.productName, item.quantity, item.price, item.price * item.quantity]);
    });
    headerRows.push(["", "TỔNG CỘNG", "", "", order.totalAmount]);
    const ws = XLSX.utils.aoa_to_sheet(headerRows);
    ws["!cols"] = [{ wch: 5 }, { wch: 40 }, { wch: 10 }, { wch: 16 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoa don");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "hoadon_" + order.id + ".xlsx");
  };

  const handleReturn = (orderId) => {
    confirm("Bạn có chắc muốn yêu cầu hoàn hàng đơn này?", async () => {
      setDialog(null);
      try {
        const res = await api.post("/cart/orders/" + orderId + "/return");
        showToast(res.data.message, "success");
        loadOrders();
      } catch (err) {
        showToast(err.response?.data?.message || "Lỗi yêu cầu hoàn hàng", "error");
      }
    });
  };

  const handleCancel = (orderId) => {
    confirm("Bạn có chắc muốn hủy đơn hàng này?", async () => {
      setDialog(null);
      try {
        const res = await api.delete("/cart/orders/" + orderId);
        showToast(res.data.message, "success");
        loadOrders();
      } catch (err) {
        showToast(err.response?.data?.message || "Lỗi hủy đơn hàng", "error");
      }
    });
  };

  const statusLabel = (status, returnStatus) => {
    if (returnStatus === "REQUESTED") return { text: "Đang hoàn hàng", cls: "status-return" };
    if (status === "RETURNED")  return { text: "Đã hoàn hàng",  cls: "status-return" };
    if (status === "CONFIRMED") return { text: "Đã giao hàng",  cls: "status-confirmed" };
    return { text: "Chờ xử lý", cls: "status-pending" };
  };

  return (
    <div className="orders-page container">
      {toast && <div className={"orders-toast orders-toast-" + toast.type}>{toast.msg}</div>}
      {dialog && <ConfirmDialog message={dialog.message} onConfirm={dialog.onConfirm} onCancel={() => setDialog(null)} />}
      {invoice && <InvoiceModal order={invoice} onClose={() => setInvoice(null)} onExport={exportExcel} />}

      <h1 className="page-title">📦 Đơn hàng của tôi</h1>

      {loading ? (
        <p className="orders-loading">Đang tải...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <p>Bạn chưa có đơn hàng nào.</p>
          <button className="orders-btn-primary" onClick={() => navigate("/product")}>Mua sắm ngay</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const { text, cls } = statusLabel(order.status, order.returnStatus);
            return (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Đơn #{order.id}</span>
                    <span className={"order-status " + cls}>{text}</span>
                  </div>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      <img src={item.productImage || "/placeholder.png"} alt={item.productName}
                        onError={e => e.target.src = "/placeholder.png"} />
                      <span className="order-item-name">{item.productName}</span>
                      <span className="order-item-qty">x{item.quantity}</span>
                      <span className="order-item-price">{(item.price * item.quantity).toLocaleString()} ₫</span>
                    </div>
                  ))}
                </div>
                <div className="order-card-footer">
                  <div className="order-meta">
                    <span>{order.paymentMethod === "COD" ? "🚚 Khi nhận hàng" : "🏦 Chuyển khoản"}</span>
                    <strong className="order-total">{order.totalAmount?.toLocaleString()} ₫</strong>
                  </div>
                  {order.shippingAddress && <span className="order-address">📍 {order.shippingAddress}</span>}
                  <button className="orders-btn-invoice" onClick={() => setInvoice(order)}>🧾 Xem hóa đơn</button>
                  {order.status === "PENDING" && (
                    <button className="orders-btn-cancel" onClick={() => handleCancel(order.id)}>✕ Hủy đơn hàng</button>
                  )}
                  {order.canReturn && (
                    <div className="order-return-zone">
                      <span className="return-days">⏳ Còn {order.daysLeft} ngày để hoàn hàng</span>
                      <button className="orders-btn-return" onClick={() => handleReturn(order.id)}>Yêu cầu hoàn hàng</button>
                    </div>
                  )}
                  {order.returnStatus === "REQUESTED" && (
                    <p className="return-note">✅ Yêu cầu hoàn hàng đã được ghi nhận. Chúng tôi sẽ liên hệ trong 24h.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
