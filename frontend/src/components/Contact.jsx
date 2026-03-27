import { useState } from "react";
import "./Contact.css";

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      background: type === "success" ? "#CC3366" : "#3A2E2A",
      color: "#fff", padding: "14px 28px", borderRadius: "12px",
      fontWeight: 700, fontSize: "1rem", zIndex: 9999,
      textAlign: "center", minWidth: "240px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
    }}>{msg}</div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", address: "", phone: "", email: "", message: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showToast("Vui lòng nhập đầy đủ thông tin bắt buộc!", "error");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast("Gửi liên hệ thành công!", "success");
        setFormData({ name: "", address: "", phone: "", email: "", message: "" });
      } else {
        showToast("Có lỗi xảy ra khi gửi liên hệ!", "error");
      }
    } catch {
      showToast("Không thể kết nối tới server!", "error");
    }
  };

  return (
    <>
      <Toast msg={toast?.msg} type={toast?.type} />
      <div className="contact-container">
        <h2>LIÊN HỆ</h2>
        <p className="contact-info">
          Địa chỉ: <strong>441/65 Điện Biên Phủ, P.25, Bình Thạnh, TP.HCM</strong><br />
          Hotline: <strong>0389 040 062 (Ms Ánh) - 0773 723 512 (Mr. Khang)</strong><br />
          Email: <a href="mailto:hotro.salontockhangkho@gmail.com">hotro.salontockhangkho@gmail.com</a>
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Họ tên <span className="text-danger">*</span></label>
            <input type="text" name="name" placeholder="Nhập họ tên" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Địa chỉ</label>
            <input type="text" name="address" placeholder="Nhập địa chỉ" value={formData.address} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Điện thoại <span className="text-danger">*</span></label>
            <input type="text" name="phone" placeholder="Số điện thoại liên hệ" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Nội dung <span className="text-danger">*</span></label>
            <textarea className="contact-textarea" name="message" placeholder="Nhập nội dung cần liên hệ"
              value={formData.message} onChange={handleChange} required
              onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} />
          </div>
          <div className="contact-buttons">
            <button type="submit" className="send">Gửi liên hệ</button>
            <button type="reset" className="reset" onClick={() => setFormData({ name: "", address: "", phone: "", email: "", message: "" })}>Reset</button>
          </div>
        </form>
      </div>
    </>
  );
}
