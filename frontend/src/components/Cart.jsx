import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Cart.css";

export default function Cart() {
  const { cartItems, cartOpen, setCartOpen, updateQty, removeItem, checkout, totalAmount } = useCart();
  const [step, setStep] = useState("cart");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderResult, setOrderResult] = useState(null);
  const [address, setAddress] = useState("");
  const [cartToast, setCartToast] = useState(null);
  const navigate = useNavigate();

  const showCartToast = (msg) => {
    setCartToast({ msg });
    setTimeout(() => setCartToast(null), 2500);
  };

  useEffect(() => {
    if (step === "payment") {
      api.get("/cart/address").then(res => {
        if (res.data.address) setAddress(res.data.address);
      }).catch(() => {});
    }
  }, [step]);

  if (!cartOpen) return null;

  const handleCheckout = async () => {
    if (!address.trim()) {
      showCartToast("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }
    try {
      const result = await checkout(paymentMethod, address);
      api.put("/cart/address", { address }).catch(() => {});
      setOrderResult(result);
      setStep("confirm");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400 || status === 401 || status === 403 || status === 500) {
        showCartToast(err.response?.data?.message || "Lỗi đặt hàng, vui lòng thử lại!");
      }
    }
  };

  const handleClose = () => {
    setCartOpen(false);
    setStep("cart");
    setOrderResult(null);
  };

  return (
    <>
      <div className="cart-overlay" onClick={handleClose} />
      <div className="cart-drawer">
        {cartToast && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "#CC3366", color: "#fff",
            padding: "14px 24px", borderRadius: "12px",
            fontWeight: 700, fontSize: "0.95rem",
            zIndex: 9999, textAlign: "center", minWidth: "220px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
          }}>
            {cartToast.msg}
          </div>
        )}

        <div className="cart-header">
          <h3>
            {step === "cart" && "🛒 Giỏ hàng"}
            {step === "payment" && "💳 Thanh toán"}
            {step === "confirm" && "✅ Đặt hàng thành công"}
          </h3>
          <button className="cart-close" onClick={handleClose}>✕</button>
        </div>

        {/* BƯỚC 1: GIỎ HÀNG */}
        {step === "cart" && (
          <>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Giỏ hàng trống</p>
                <button className="cart-btn-outline" onClick={() => { handleClose(); navigate("/product"); }}>
                  Xem sản phẩm
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.productImage || "/placeholder.png"} alt={item.productName}
                        onError={e => e.target.src = "/placeholder.png"} />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.productName}</p>
                        <p className="cart-item-price">{(item.productPrice * item.quantity).toLocaleString()} ₫</p>
                        <div className="cart-qty">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button className="cart-remove" onClick={() => removeItem(item.id)}>🗑</button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">Tổng: <strong>{totalAmount.toLocaleString()} ₫</strong></div>
                  <button className="cart-btn-primary" onClick={() => setStep("payment")}>
                    Tiến hành thanh toán →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* BƯỚC 2: THANH TOÁN */}
        {step === "payment" && (
          <div className="cart-payment">
            {/* Địa chỉ — bắt buộc */}
            <div className="address-section">
              <p className="payment-label">📍 Địa chỉ nhận hàng <span style={{color:"#CC3366"}}>*</span></p>
              <input
                className={`address-input${!address.trim() ? " address-error" : ""}`}
                type="text"
                placeholder="Nhập địa chỉ nhận hàng (bắt buộc)..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              {!address.trim() && <small style={{color:"#CC3366",fontSize:"0.8rem"}}>Vui lòng nhập địa chỉ</small>}
            </div>

            <p className="payment-label">Phương thức thanh toán:</p>
            <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
              <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              <span className="payment-icon">🚚</span>
              <div><strong>Thanh toán khi nhận hàng</strong><small>Trả tiền mặt khi nhận hàng tại nhà</small></div>
            </label>
            <label className={`payment-option ${paymentMethod === "BANK" ? "selected" : ""}`}>
              <input type="radio" value="BANK" checked={paymentMethod === "BANK"} onChange={() => setPaymentMethod("BANK")} />
              <span className="payment-icon">🏦</span>
              <div><strong>Chuyển khoản ngân hàng</strong><small>Thanh toán qua tài khoản ngân hàng</small></div>
            </label>
            {paymentMethod === "BANK" && (
              <div className="bank-info">
                <p>Ngân hàng: <strong>Vietcombank</strong></p>
                <p>STK: <strong>1234 5678 9012</strong></p>
                <p>Chủ TK: <strong>SALON TORO</strong></p>
                <p>Nội dung: <strong>Thanh toán đơn hàng</strong></p>
              </div>
            )}
            <div className="cart-footer">
              <div className="cart-total">Tổng: <strong>{totalAmount.toLocaleString()} ₫</strong></div>
              <div className="payment-actions">
                <button className="cart-btn-outline" onClick={() => setStep("cart")}>← Quay lại</button>
                <button className="cart-btn-primary" onClick={handleCheckout}>Xác nhận đặt hàng ✓</button>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 3: XÁC NHẬN */}
        {step === "confirm" && orderResult && (
          <div className="cart-confirm">
            <div className="confirm-icon">✅</div>
            <h4>Đặt hàng thành công!</h4>
            <p>Mã đơn hàng: <strong>#{orderResult.orderId}</strong></p>
            <p>Tổng tiền: <strong>{orderResult.total?.toLocaleString()} ₫</strong></p>
            <p>Phương thức: <strong>{orderResult.paymentMethod === "COD" ? "Khi nhận hàng" : "Chuyển khoản"}</strong></p>
            {orderResult.shippingAddress && <p>📍 <strong>{orderResult.shippingAddress}</strong></p>}
            <p className="confirm-note">Cảm ơn bạn đã mua hàng tại Salon TORO! Xem lại hóa đơn trong mục "Đơn hàng".</p>
            <button className="cart-btn-primary" onClick={handleClose}>Đóng</button>
          </div>
        )}
      </div>
    </>
  );
}
