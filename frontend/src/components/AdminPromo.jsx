import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AdminPanel.css";

export default function AdminPromo() {
  const [promo, setPromo] = useState({ title: "", description: "", discount: "", suffix: "" });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/"); return; }
    api.get("/promo").then(res => {
      if (res.data && typeof res.data === "object") setPromo({ title: "", description: "", discount: "", suffix: "", ...res.data });
    }).catch(() => {});
  }, []);

  const set = (field, val) => setPromo(p => ({ ...p, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    await api.post("/promo", promo);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-panel container">
      <h1 className="page-title">🎉 Quản lý Khuyến mãi</h1>
      <form className="admin-form" onSubmit={handleSave}>
        <label>Tiêu đề</label>
        <input value={promo.title} onChange={e => set("title", e.target.value)} placeholder="VD: 🎉 Khuyến mãi đặc biệt" />
        <label>Mô tả trước số %</label>
        <input value={promo.description} onChange={e => set("description", e.target.value)} placeholder="VD: Giảm ngay" />
        <label>Phần trăm giảm (%)</label>
        <input type="number" value={promo.discount} onChange={e => set("discount", e.target.value)} placeholder="VD: 30" min="0" max="100" />
        <label>Mô tả sau số %</label>
        <input value={promo.suffix} onChange={e => set("suffix", e.target.value)} placeholder="VD: cho dịch vụ uốn/nhuộm trong tháng này!" />
        <div className="admin-preview">
          <span>Xem trước: </span>
          <em>{promo.description} <strong>{promo.discount}%</strong> {promo.suffix}</em>
        </div>
        <button type="submit" className="admin-btn-save">{saved ? "✅ Đã lưu!" : "💾 Lưu thay đổi"}</button>
      </form>
    </div>
  );
}
