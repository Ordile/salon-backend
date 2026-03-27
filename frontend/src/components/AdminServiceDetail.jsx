import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ImageUpload from "./ImageUpload";
import "./AdminPanel.css";

const CATEGORIES = [
  { key: "nhuom", label: "Nhuộm tóc" },
  { key: "uon",   label: "Uốn tóc" },
  { key: "taokieu", label: "Tạo kiểu tóc" },
  { key: "catnam",  label: "Cắt tóc nam" },
];

const EMPTY_ITEM = { imageUrl: "", title: "", description: "", price: "" };
const EMPTY_PRICE = { label: "", price: "" };

export default function AdminServiceDetail() {
  const [tab, setTab] = useState("nhuom");
  const [data, setData] = useState({});
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/"); return; }
    CATEGORIES.forEach(c => {
      api.get(`/service-detail/${c.key}`).then(r => {
        const d = r.data && typeof r.data === "object" && !Array.isArray(r.data) ? r.data : {};
        setData(prev => ({
          ...prev,
          [c.key]: {
            banner: d.banner || { title: "", description: "" },
            items: Array.isArray(d.items) ? d.items : [],
            prices: Array.isArray(d.prices) ? d.prices : [],
          }
        }));
      }).catch(() => {
        setData(prev => ({ ...prev, [c.key]: { banner: { title: "", description: "" }, items: [], prices: [] } }));
      });
    });
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const cur = data[tab] || { banner: { title: "", description: "" }, items: [], prices: [] };

  const setItems = (items) => setData(prev => ({ ...prev, [tab]: { ...cur, items } }));
  const setPrices = (prices) => setData(prev => ({ ...prev, [tab]: { ...cur, prices } }));

  const save = async () => {
    await api.post(`/service-detail/${tab}`, cur);
    showToast("✅ Đã lưu!");
  };

  return (
    <div className="admin-panel container">
      {toast && <div className="admin-toast">{toast}</div>}
      <h1 className="page-title">✂️ Quản lý Dịch vụ</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        {CATEGORIES.map(c => (
          <button key={c.key} className={`admin-tab${tab === c.key ? " active" : ""}`} onClick={() => setTab(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Ảnh dịch vụ */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Ảnh dịch vụ</h2>
          <button className="admin-btn-add" onClick={() => setItems([...cur.items, { ...EMPTY_ITEM }])}>+ Thêm</button>
        </div>
        {cur.items.map((item, i) => (
          <div className="admin-card" key={i}>
            <ImageUpload value={item.imageUrl} onChange={url => {
              const arr = [...cur.items]; arr[i] = { ...arr[i], imageUrl: url }; setItems(arr);
            }} label={`Ảnh ${i + 1}`} />
            <input placeholder="Tiêu đề" value={item.title || ""} onChange={e => {
              const arr = [...cur.items]; arr[i] = { ...arr[i], title: e.target.value }; setItems(arr);
            }} />
            <button className="admin-btn-remove" onClick={() => setItems(cur.items.filter((_, idx) => idx !== i))}>🗑</button>
          </div>
        ))}
      </section>

      {/* Bảng giá */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Bảng giá</h2>
          <button className="admin-btn-add" onClick={() => setPrices([...cur.prices, { ...EMPTY_PRICE }])}>+ Thêm</button>
        </div>
        {cur.prices.map((p, i) => (
          <div className="admin-card admin-card-row" key={i}>
            <input placeholder="Tên dịch vụ" value={p.label || ""} onChange={e => {
              const arr = [...cur.prices]; arr[i] = { ...arr[i], label: e.target.value }; setPrices(arr);
            }} />
            <input placeholder="Giá (VD: 400.000đ – 700.000đ)" value={p.price || ""} onChange={e => {
              const arr = [...cur.prices]; arr[i] = { ...arr[i], price: e.target.value }; setPrices(arr);
            }} />
            <button className="admin-btn-remove" onClick={() => setPrices(cur.prices.filter((_, idx) => idx !== i))}>🗑</button>
          </div>
        ))}
      </section>

      <button className="admin-btn-save" onClick={save}>💾 Lưu dịch vụ {CATEGORIES.find(c => c.key === tab)?.label}</button>
    </div>
  );
}
