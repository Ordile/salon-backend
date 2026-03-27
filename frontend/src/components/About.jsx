import React from "react";
import "./About.css";
import logo from "../assets/logo.png"; 

export default function About() {
  return (
    <div className="about-page">
      {/* Banner đầu trang */}
      <section className="about-banner">
        <h1>Về Chúng Tôi</h1>
        <p>Salon TORO – Nâng tầm phong cách, tôn vinh vẻ đẹp của bạn</p>
      </section>

      {/* Nội dung chính */}
      <section className="about-content">
        <div className="about-image">
          {/* 👉 Thay ảnh salon bằng logo */}
          <img src={logo} alt="Logo Salon TORO" className="about-logo-main" />
        </div>
        <div className="about-text">
          <h2>Salon Tóc TORO – Nơi phong cách bắt đầu</h2>
          <p>
            Với đội ngũ chuyên viên làm tóc hàng đầu, <b>Salon TORO</b> mang đến
            cho bạn trải nghiệm làm đẹp đẳng cấp và dịch vụ chăm sóc tóc chuyên
            nghiệp. Chúng tôi tự hào là điểm đến tin cậy cho khách hàng yêu thích
            sự tinh tế và hiện đại.
          </p>
          <p>
            Không chỉ là nơi làm tóc, Salon TORO còn là không gian thư giãn, nơi
            bạn được lắng nghe và thấu hiểu để tìm ra phong cách phù hợp nhất với
            bản thân.
          </p>
          <p>
            Đến với chúng tôi – bạn sẽ không chỉ thay đổi mái tóc, mà còn thay đổi
            cả cảm xúc và phong thái.
          </p>
        </div>
      </section>
    </div>
  );
}
