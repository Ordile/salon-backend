import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./MyOrders.css";

// Dialog xác nhận giữa màn hình
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

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState(null); // { message, onConfirm }
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const loadOrders = () => {
    api.get("/cart/orders")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadOrders();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const confirm = (message, onConfirm) => {
    setDialog({ message, onConfirm });
  };

  const handleReturn = (orderId) => {
    confirm("Bạn có chắc muốn yêu cầu hoàn hàng đơn này?", async () => {
      setDialog(null);
      try {
        const res = await api.post(`/cart/orders/${orderId}/return`);
        showToast(res.data.message, "success");
        loadOrders();
      } catch (err) {
        showToast(err.response?.data?.message || "Lỗi yêu cầu hoàn hàng", "error");
      }
    });
  };

  const handleCancel = (orderId) => {
    confirm("Bạn có chắc muốn hủy đơn hàng này? Đơn sẽ bị xóa khỏi hệ thống.", async () => {
      setDialog(null);
      try {
        const res = await api.delete(`/cart/orders/${orderId}`);
        showToast(res.data.message, "success");
        loadOrders();
      } catch (err) {
        showToast(err.response?.data?.message || "Lỗi hủy đơn hàng", "error");
      }
    });
  };

  const statusLabel = (status, returnStatus) => {
    if (returnStatus === "REQUESTED") return { text: "Đang hoàn hàng", cls: "status-return" };
    if (status === "RETURNED")   return { text: "Đã hoàn hàng",   cls: "status-return" };
    if (status === "CONFIRMED")  return { text: "Đã giao hàng",   cls: "status-confirmed" };
    return { text: "Chờ xử lý", cls: "status-pending" };
  };

  return (
    <div className="orders-page container">
      {toast && <div className={`orders-toast orders-toast-${toast.type}`}>{toast.msg}</div>}
      {dialog && (
        <ConfirmDialog
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onCancel={() => setDialog(null)}
        />
      )}

      <h1 className="page-title">📦 Đơn hàng của tôi</h1>

      {loading ? (
        <p className="orders-loading">Đang tải...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <p>Bạn chưa có đơn hàng nào.</p>
          <button className="orders-btn-primary" onClick={() => navigate("/product")}>
            Mua sắm ngay
          </button>
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
                    <span className={`order-status ${cls}`}>{text}</span>
                  </div>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      <img src={item.productImage || "/placeholder.png"} alt={item.productName}
                        onError={e => e.target.src = "/placeholder.png"} />
                      <span className="order-item-name">{item.productName}</span>
                      <span className="order-item-qty">x{item.quantity}</span>
                      <span className="order-item-price">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-meta">
                    <span>{order.paymentMethod === "COD" ? "🚚 Khi nhận hàng" : "🏦 Chuyển khoản"}</span>
                    <strong className="order-total">{order.totalAmount?.toLocaleString()} ₫</strong>
                  </div>
                  {order.shippingAddress && (
                    <span>📍 {order.shippingAddress}</span>
                  )}

                  {/* Nút hủy đơn — chỉ khi PENDING */}
                  {order.status === "PENDING" && (
                    <button className="orders-btn-cancel" onClick={() => handleCancel(order.id)}>
                      ✕ Hủy đơn hàng
                    </button>
                  )}

                  {/* Nút hoàn hàng — chỉ hiện khi đã giao và còn trong 7 ngày */}
                  {order.canReturn && (
                    <div className="order-return-zone">
                      <span className="return-days">⏳ Còn {order.daysLeft} ngày để hoàn hàng</span>
                      <button className="orders-btn-return" onClick={() => handleReturn(order.id)}>
                        Yêu cầu hoàn hàng
                      </button>
                    </div>
                  )}

                  {order.returnStatus === "REQUESTED" && (
                    <p className="return-note">
                      ✅ Yêu cầu hoàn hàng đã được ghi nhận. Chúng tôi sẽ liên hệ trong 24h.
                    </p>
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
