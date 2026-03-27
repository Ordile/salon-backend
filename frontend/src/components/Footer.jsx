import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-section">
          <h3>💈 Salon TORO</h3>
          <p>
            Tự hào mang đến cho bạn những dịch vụ làm tóc chuyên nghiệp, phong
            cách và đẳng cấp. Nơi tôn vinh vẻ đẹp tự nhiên của bạn.
          </p>
        </div>

        {/* Cột 2: Dịch vụ */}
        <div className="footer-section">
          <h3>Dịch vụ nổi bật</h3>
          <ul>
            <li>Cắt – Tạo kiểu</li>
            <li>Uốn tóc</li>
            <li>Nhuộm tóc</li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p>📍 123 Nguyễn Trãi, Quận 5, TP.HCM</p>
          <p>📞 0909 123 456</p>
          <p>📧 contact@salon.vn</p>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="footer-bottom">
        <p>© 2025 Salon TORO. Thiết kế bởi nhóm Dev Tóc Đẹp </p>
      </div>
    </footer>
  );
}
