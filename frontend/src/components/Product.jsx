import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../CartContext";
import "./Product.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    api.get("/products").then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 1800);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "warn");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    const ok = await addToCart(productId);
    if (ok) showToast("Đã thêm vào giỏ hàng!", "success");
  };

  const filtered = query
    ? products.filter(p =>
        p.name?.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <div className="product-page container">
      {toast && (
        <div className={`product-toast product-toast-${toast.type}`}>{toast.msg}</div>
      )}

      <div className="product-header">
        <h1 className="page-title">💇‍♀️ Sản phẩm của Salon TORO</h1>
        {user?.role === "ADMIN" && (
          <button className="admin-btn" onClick={() => navigate("/admin/product")}>
            🛠 Quản lý sản phẩm
          </button>
        )}
      </div>

      {/* Thanh tìm kiếm */}
      <div className="product-search-wrap">
        <span className="product-search-icon">🔍</span>
        <input
          className="product-search"
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") setQuery(search.trim());
          }}
        />
        {search && (
          <button className="product-search-clear" onClick={() => {
            setSearch("");
            setQuery("");
          }}>✕</button>
        )}
      </div>

      {/* Kết quả */}
      {query && (
        <p className="product-search-result">
          {filtered.length > 0
            ? `Tìm thấy ${filtered.length} sản phẩm cho "${query}"`
            : `Không tìm thấy sản phẩm nào cho "${query}"`}
        </p>
      )}

      <div className="product-grid">
        {filtered.length === 0 && !search ? (
          <p className="loading-text">Không có sản phẩm.</p>
        ) : filtered.length === 0 ? (
          <p className="loading-text">Không tìm thấy sản phẩm.</p>
        ) : (
          filtered.map(p => (
            <div
              className={`product-card${hoveredId === p.id ? " hovered" : ""}`}
              key={p.id}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={p.imageUrl || "/placeholder.png"}
                alt={p.name}
                className="product-img"
                onError={e => e.target.src = "/placeholder.png"}
              />
              <h3 className="product-name">{p.name}</h3>
              <p className="desc">{p.description || "Không có mô tả"}</p>
              <p className="price">{p.price ? p.price.toLocaleString() : 0} ₫</p>
              <button className="btn-add-cart" onClick={(e) => { e.currentTarget.blur(); handleAddToCart(p.id); }}>
                🛒 Thêm vào giỏ
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
