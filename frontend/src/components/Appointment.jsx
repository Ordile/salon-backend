import { useState } from "react";
import "./Appointment.css";

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

export default function Appointment() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", appointmentDate: "", note: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.appointmentDate) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast("Đặt lịch hẹn thành công!", "success");
        setFormData({ name: "", phone: "", appointmentDate: "", note: "" });
        setTimeout(() => setShowForm(false), 1800);
      } else {
        showToast("Có lỗi xảy ra khi đặt lịch!", "error");
      }
    } catch {
      showToast("Không thể kết nối tới server!", "error");
    }
  };

  return (
    <>
      <Toast msg={toast?.msg} type={toast?.type} />
      <button className="floating-btn" onClick={() => setShowForm(!showForm)}>🗓️ Đặt lịch</button>

      {showForm && (
        <div className="appointment-overlay" onClick={() => setShowForm(false)}>
          <div className="appointment-form" onClick={e => e.stopPropagation()}>
            <h2>ĐẶT LỊCH HẸN</h2>
            <form onSubmit={handleSubmit}>
              <label>Họ tên:</label>
              <input type="text" name="name" placeholder="Nhập họ tên" value={formData.name} onChange={handleChange} required />
              <label>Điện thoại:</label>
              <input type="tel" name="phone" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange} required />
              <label>Ngày giờ:</label>
              <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
              <label>Ghi chú:</label>
              <textarea name="note" placeholder="Ghi chú thêm (nếu có)" value={formData.note} onChange={handleChange} />
              <button type="submit">Đặt lịch hẹn</button>
            </form>
            <span className="close-btn" onClick={() => setShowForm(false)}>✖</span>
          </div>
        </div>
      )}
    </>
  );
}
