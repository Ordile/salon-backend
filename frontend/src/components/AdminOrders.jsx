import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AdminPanel.css";
import "./MyOrders.css";

function InvoiceModal({ order, onClose, onExport }) {
  return (
    <div className="confirm-backdrop" onClick={onClose}>
      <div className="invoice-modal" onClick={e => e.stopPropagation()}>
        <div className="invoice-header">
          <h3>🧾 Hóa đơn — {order.username}</h3>
          <button className="invoice-close" onClick={onClose}>✕</button>
        </div>
        <div className="invoice-info">
          <p><strong>Khách hàng:</strong> {order.username}</p>
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/"); return; }
    api.get("/admin/orders")
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Admin orders error:", err.response?.status, err.response?.data);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const exportExcel = (order) => {
    // Tạo header info trước
    const headerRows = [
      [`Khách hàng: ${order.username}`],
      [`Mã đơn: #${order.id}  |  Ngày: ${new Date(order.createdAt).toLocaleDateString("vi-VN")}`],
      [`Địa chỉ: ${order.shippingAddress || "Không có"}`],
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
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `hoadon_${order.username}_${order.id}.xlsx`);
  };

  const exportAll = () => {
    const rows = [];
    orders.forEach(order => {
      order.items.forEach((item, i) => {
        rows.push({
          "Khách hàng": order.username,
          "Mã đơn": `#${order.id}`,
          "Ngày mua": new Date(order.createdAt).toLocaleDateString("vi-VN"),
          "STT": i + 1,
          "Tên sản phẩm": item.productName,
          "Số lượng": item.quantity,
          "Đơn giá (đ)": item.price,
          "Thành tiền (đ)": item.price * item.quantity,
          "Tổng đơn (đ)": i === 0 ? order.totalAmount : "",
          "Trạng thái": order.status,
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 15 }, { wch: 8 }, { wch: 12 }, { wch: 5 }, { wch: 35 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tat ca don hang");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `tatca_donhang.xlsx`);
  };

  const statusLabel = (status) => {
    if (status === "RETURNED")  return { text: "Đã hoàn hàng",  cls: "status-return" };
    if (status === "CONFIRMED") return { text: "Đã giao hàng",  cls: "status-confirmed" };
    return { text: "Chờ xử lý", cls: "status-pending" };
  };

  const filtered = orders.filter(o =>
    o.username?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  );

  return (
    <div className="admin-panel container">
      {invoice && <InvoiceModal order={invoice} onClose={() => setInvoice(null)} onExport={exportExcel} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>📋 Quản lý đơn hàng</h1>
        <button className="admin-btn-save" onClick={exportAll}>📥 Xuất tất cả Excel</button>
      </div>

      <input
        style={{ width: "100%", maxWidth: 360, padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e0d0c0", marginBottom: 20, fontSize: "0.95rem" }}
        placeholder="Tìm theo tên khách hàng hoặc mã đơn..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? <p>Đang tải...</p> : filtered.length === 0 ? <p>Không có đơn hàng.</p> : (
        <div className="orders-list">
          {filtered.map(order => {
            const { text, cls } = statusLabel(order.status);
            return (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Đơn #{order.id}</span>
                    <span style={{ color: "#f5e6d0", marginLeft: 8 }}>👤 {order.username}</span>
                    <span className={`order-status ${cls}`} style={{ marginLeft: 8 }}>{text}</span>
                  </div>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
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
                  <button className="orders-btn-invoice" onClick={() => setInvoice(order)}>🧾 Xem & Xuất hóa đơn</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
