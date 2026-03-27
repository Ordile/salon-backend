import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { totalCount, setCartOpen } = useCart();

  useEffect(() => {
    const updateUser = () => {
      const stored = sessionStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const closeAll = () => {
    setMenuOpen(false);
    setServiceOpen(false);
    setAdminOpen(false);
  };

  return (
    <>
      {menuOpen && <div className="menu-overlay" onClick={closeAll} />}

      <nav className="navbar">
        <div className="navbar-container">

          {/* Logo - trái */}
          <div className="navbar-logo">
            <img src={logo} alt="Salon TORO" className="logo-img" />
            <span className="brand-name">Salon TORO</span>
          </div>

          {/* Menu */}
          <ul className={`navbar-menu${menuOpen ? " open" : ""}`}>
            {/* Nút X đóng menu - chỉ hiện trên mobile */}
            <li className="menu-close-btn">
              <button onClick={closeAll} aria-label="Đóng menu">✕</button>
            </li>

            <li><Link to="/" onClick={closeAll}>Trang chủ</Link></li>
            <li><Link to="/about" onClick={closeAll}>Giới thiệu</Link></li>

            {/* Dịch vụ */}
            <li
              className="dropdown"
              onMouseEnter={() => setServiceOpen(true)}
              onMouseLeave={() => setServiceOpen(false)}
            >
              <span className="dropdown-title" onClick={() => setServiceOpen(o => !o)}>
                Dịch vụ {serviceOpen ? "▴" : "▾"}
              </span>
              <ul className={`sub-menu${serviceOpen ? " show" : ""}`}>
                <li><Link to="/service/nhuom" onClick={closeAll}>Nhuộm tóc</Link></li>
                <li><Link to="/service/uon" onClick={closeAll}>Uốn tóc</Link></li>
                <li><Link to="/service/taokieu" onClick={closeAll}>Tạo kiểu tóc</Link></li>
                <li><Link to="/service/catnam" onClick={closeAll}>Cắt tóc nam</Link></li>
              </ul>
            </li>

            {user?.role === "ADMIN" && (
              <li
                className="dropdown"
                onMouseEnter={() => setAdminOpen(true)}
                onMouseLeave={() => setAdminOpen(false)}
              >
                <span className="dropdown-title" onClick={() => setAdminOpen(o => !o)}>
                  Quản lý {adminOpen ? "▴" : "▾"}
                </span>
                <ul className={`sub-menu${adminOpen ? " show" : ""}`}>
                  <li><Link to="/admin/product" onClick={closeAll}>Sản phẩm</Link></li>
                  <li><Link to="/admin/orders" onClick={closeAll}>Đơn hàng</Link></li>
                  <li><Link to="/admin/contacts" onClick={closeAll}>Lịch hẹn & Liên hệ</Link></li>
                  <li><Link to="/admin/promo" onClick={closeAll}>Khuyến mãi</Link></li>
                  <li><Link to="/admin/home-content" onClick={closeAll}>Trang chủ</Link></li>
                  <li><Link to="/admin/service-detail" onClick={closeAll}>Dịch vụ</Link></li>
                </ul>
              </li>
            )}

            <li><Link to="/product" onClick={closeAll}>Sản phẩm</Link></li>
            <li><Link to="/contact" onClick={closeAll}>Liên hệ</Link></li>
            {user && <li><Link to="/my-orders" onClick={closeAll}>Đơn hàng</Link></li>}

            {/* Login/logout bên trong menu - chỉ hiện trên mobile */}
            <li className="mobile-auth">
              {user ? (
                <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
              ) : (
                <Link to="/login" className="login-btn" onClick={closeAll}>Đăng nhập</Link>
              )}
            </li>
          </ul>

          {/* Phải: theme + login (desktop) + hamburger (mobile) */}
          <div className="navbar-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Giỏ hàng */}
            <button className="cart-icon-btn" onClick={() => setCartOpen(true)} aria-label="Giỏ hàng">
              🛒
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </button>

            {/* Login/logout - chỉ hiện trên desktop */}
            <div className="desktop-auth">
              {user ? (
                <div className="user-info">
                  <span className="welcome-text">👋 <b>{user.username}</b></span>
                  <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                </div>
              ) : (
                <Link to="/login" className="login-btn" onClick={closeAll}>Đăng nhập</Link>
              )}
            </div>

            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}
