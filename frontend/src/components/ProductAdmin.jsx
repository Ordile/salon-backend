import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ImageUpload from "./ImageUpload";
import "./Product.css";
import "./MyOrders.css"; // dùng lại ConfirmDialog CSS

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

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/product"); return; }
  }, []);

  const fetchProducts = () => {
    api.get("/products").then(res => setProducts(res.data)).catch(console.error);
  };
  useEffect(fetchProducts, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imageUrl) { showToast("Vui lòng chọn ảnh sản phẩm!", "error"); return; }
    const req = editingId ? api.put(`/products/${editingId}`, form) : api.post("/products", form);
    req.then(() => {
      showToast(editingId ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
      setForm({ name: "", description: "", price: "", imageUrl: "" });
      setEditingId(null);
      fetchProducts();
    }).catch(() => showToast("Lỗi lưu sản phẩm!", "error"));
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, imageUrl: p.imageUrl });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setDialog({
      message: "Bạn có chắc muốn xóa sản phẩm này?",
      onConfirm: () => {
        setDialog(null);
        api.delete(`/products/${id}`)
          .then(() => { showToast("Đã xóa sản phẩm!"); fetchProducts(); })
          .catch(() => showToast("Lỗi xóa!", "error"));
      }
    });
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="product-page container">
      {toast && <div className={`product-toast product-toast-${toast.type === "error" ? "warn" : "success"}`}>{toast.msg}</div>}
      {dialog && (
        <ConfirmDialog
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onCancel={() => setDialog(null)}
        />
      )}

      <h1 className="page-title">🛠 Quản lý sản phẩm</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <ImageUpload value={form.imageUrl} onChange={url => set("imageUrl", url)} label="Ảnh sản phẩm" />
        <input type="text" placeholder="Tên sản phẩm" value={form.name} onChange={e => set("name", e.target.value)} required />
        <textarea placeholder="Mô tả sản phẩm" value={form.description} onChange={e => set("description", e.target.value)} required />
        <input type="number" placeholder="Giá (VD: 270000)" value={form.price} onChange={e => set("price", e.target.value)} required />
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn-save" style={{ flex: 1 }}>
            {editingId ? "💾 Cập nhật" : "➕ Thêm mới"}
          </button>
          {editingId && (
            <button type="button" className="btn-save" style={{ flex: 1, background: "#888" }}
              onClick={() => { setForm({ name: "", description: "", price: "", imageUrl: "" }); setEditingId(null); }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.imageUrl || "/placeholder.png"} alt={p.name} className="admin-product-img"
                  onError={e => e.target.src = "/placeholder.png"} /></td>
                <td className="admin-name">{p.name}</td>
                <td className="admin-desc">{p.description}</td>
                <td className="admin-price">{Number(p.price)?.toLocaleString()} ₫</td>
                <td className="admin-actions">
                  <button onClick={() => handleEdit(p)} className="btn-edit">✏️ Sửa</button>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
