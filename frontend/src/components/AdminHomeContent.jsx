import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ImageUpload from "./ImageUpload";
import "./AdminPanel.css";

const EMPTY_SERVICE = { title: "", description: "", imageUrl: "" };
const EMPTY_ALBUM = { imageUrl: "", alt: "" };

export default function AdminHomeContent() {
  const [services, setServices] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/"); return; }
    api.get("/home-content/services").then(r => {
      setServices(Array.isArray(r.data) ? r.data : []);
    }).catch(() => setServices([]));
    api.get("/home-content/albums").then(r => {
      setAlbums(Array.isArray(r.data) ? r.data : []);
    }).catch(() => setAlbums([]));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  // Services
  const addService = () => setServices([...services, { ...EMPTY_SERVICE }]);
  const updateService = (i, field, val) => {
    const arr = [...services]; arr[i] = { ...arr[i], [field]: val }; setServices(arr);
  };
  const removeService = (i) => setServices(services.filter((_, idx) => idx !== i));
  const saveServices = async () => {
    await api.post("/home-content/services", services);
    showToast("✅ Đã lưu dịch vụ nổi bật!");
  };

  // Albums
  const addAlbum = () => setAlbums([...albums, { ...EMPTY_ALBUM }]);
  const updateAlbum = (i, field, val) => {
    const arr = [...albums]; arr[i] = { ...arr[i], [field]: val }; setAlbums(arr);
  };
  const removeAlbum = (i) => setAlbums(albums.filter((_, idx) => idx !== i));
  const saveAlbums = async () => {
    await api.post("/home-content/albums", albums);
    showToast("✅ Đã lưu album ảnh!");
  };

  return (
    <div className="admin-panel container">
      {toast && <div className="admin-toast">{toast}</div>}
      <h1 className="page-title">🏠 Quản lý Trang chủ</h1>

      {/* Dịch vụ nổi bật */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Dịch vụ nổi bật</h2>
          <button className="admin-btn-add" onClick={addService}>+ Thêm</button>
        </div>
        {services.map((s, i) => (
          <div className="admin-card" key={i}>
            <ImageUpload value={s.imageUrl} onChange={url => updateService(i, "imageUrl", url)} label="Ảnh" />
            <input placeholder="Tiêu đề" value={s.title} onChange={e => updateService(i, "title", e.target.value)} />
            <input placeholder="Mô tả" value={s.description} onChange={e => updateService(i, "description", e.target.value)} />
            <button className="admin-btn-remove" onClick={() => removeService(i)}>🗑 Xóa</button>
          </div>
        ))}
        <button className="admin-btn-save" onClick={saveServices}>💾 Lưu dịch vụ nổi bật</button>
      </section>

      {/* Album ảnh */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Album ảnh</h2>
          <button className="admin-btn-add" onClick={addAlbum}>+ Thêm</button>
        </div>
        {albums.map((a, i) => (
          <div className="admin-card" key={i}>
            <ImageUpload value={a.imageUrl} onChange={url => updateAlbum(i, "imageUrl", url)} label="Ảnh" />
            <input placeholder="Mô tả ảnh" value={a.alt} onChange={e => updateAlbum(i, "alt", e.target.value)} />
            <button className="admin-btn-remove" onClick={() => removeAlbum(i)}>🗑 Xóa</button>
          </div>
        ))}
        <button className="admin-btn-save" onClick={saveAlbums}>💾 Lưu album ảnh</button>
      </section>
    </div>
  );
}
