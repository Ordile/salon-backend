import React from "react";
import "./Service.css";
import serviceImg1 from "../assets/service/t7.jpg";
import serviceImg2 from "../assets/service/t1.jpg";
import serviceImg3 from "../assets/service/t4.jpg";
import serviceImg4 from "../assets/service/t10.jpg";

export default function Service() {
  const services = [
    { id: 1, title: "Tóc ngắn xoăn nhẹ", img: serviceImg1, desc: "Tóc cắt ngắn quá cằm và làm xoăn nhẹ nhàng phần đuôi, kết hợp cùng một mái thưa sẽ khiến nhiều anh chàng phải mê." },
    { id: 2, title: "Nhuộm tóc màu xám khói", img: serviceImg2, desc: "Muốn nhuộm màu tóc xám khói đẹp thì cần phải cân bằng với màu tóc tự nhiên." },
    { id: 3, title: "Uốn cúp dợn", img: serviceImg3, desc: "Styling chuyên nghiệp, phù hợp khuôn mặt." },
    { id: 4, title: "Kiểu tóc uốn đuôi dễ thương", img: serviceImg4, desc: "Tóc uốn đuôi chính là kiểu tóc đơn giản, gọn gàng và cực dễ thực hiện mà cô .... đã “nâng niu” khuôn mặt của.." },
    // thêm các dịch vụ khác
  ];

  return (
    <div className="service-page">
      {/* Banner */}
      <section className="service-banner">
        <h1>Dịch Vụ Của Chúng Tôi</h1>
        <p>Cam kết chất lượng – Tôn vinh vẻ đẹp của bạn</p>
      </section>

      {/* Dịch vụ nổi bật */}
      <section className="service-grid">
        <div className="container">
          <h2 className="section-title">Dịch Vụ Nổi Bật</h2>
          <div className="grid">
            {services.map((s) => (
              <div key={s.id} className="service-card">
                <img src={s.img} alt={s.title} />
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
