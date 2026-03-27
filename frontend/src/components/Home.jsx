import { useEffect, useState } from "react";
import banner from "../assets/banner.png";
import aboutImg from "../assets/aa.jpg";
import defaultS1 from "../assets/a1.jpg";
import defaultS2 from "../assets/a2.jpg";
import defaultS3 from "../assets/a3.jpg";
import defaultA1 from "../assets/a5.jpg";
import defaultA2 from "../assets/a8.jpg";
import defaultA3 from "../assets/a12.jpg";
import api from "../api";

const DEFAULT_SERVICES = [
  { title: "Cắt tóc chuyên nghiệp", description: "Được thực hiện bởi các stylist giàu kinh nghiệm.", imageUrl: defaultS1 },
  { title: "Uốn & Nhuộm thời trang", description: "Sử dụng sản phẩm cao cấp, an toàn cho tóc và da đầu.", imageUrl: defaultS2 },
  { title: "Gội đầu thư giãn", description: "Trải nghiệm chăm sóc nhẹ nhàng, giúp bạn thư giãn tối đa.", imageUrl: defaultS3 },
];
const DEFAULT_ALBUMS = [
  { imageUrl: defaultA1, alt: "Album 1" },
  { imageUrl: defaultA2, alt: "Album 2" },
  { imageUrl: defaultA3, alt: "Album 3" },
];
const DEFAULT_PROMO = { title: "🎉 Khuyến mãi đặc biệt", description: "Giảm ngay", discount: "30", suffix: "% cho dịch vụ uốn/nhuộm trong tháng này!" };

export default function Home() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [albums, setAlbums] = useState(DEFAULT_ALBUMS);
  const [promo, setPromo] = useState(DEFAULT_PROMO);

  useEffect(() => {
    api.get("/home-content/services").then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setServices(r.data);
    }).catch(() => {});
    api.get("/home-content/albums").then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setAlbums(r.data);
    }).catch(() => {});
    api.get("/promo").then(r => {
      if (r.data && r.data.title) setPromo(r.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      {/* Banner */}
      <div className="banner position-relative">
        <img src={banner} alt="Salon Banner" className="w-100"
          style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
      </div>

      {/* Về chúng tôi */}
      <section className="about-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="mb-4 fw-bold">Về Chúng Tôi</h2>
              <p className="text-muted">
                Salon Tóc TORO mang đến cho bạn trải nghiệm làm đẹp chuyên nghiệp,
                không gian sang trọng và đội ngũ stylist tận tâm. Chúng tôi luôn
                cập nhật xu hướng mới nhất để giúp bạn tự tin tỏa sáng.
              </p>
            </div>
            <div className="col-md-6">
              <img src={aboutImg} alt="Về chúng tôi" className="img-fluid rounded-4 shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* Dịch vụ nổi bật */}
      <section className="services py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Dịch Vụ Nổi Bật</h2>
          <div className="row">
            {services.map((s, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div className="card border-0 shadow-sm">
                  <img src={s.imageUrl} className="card-img-top" alt={s.title}
                    style={{ height: "400px", objectFit: "cover" }}
                    onError={e => e.target.src = defaultS1} />
                  <div className="card-body">
                    <h5 className="card-title">{s.title}</h5>
                    <p className="card-text text-muted">{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Album Ảnh */}
      <section className="album py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Album Ảnh</h2>
          <div className="row g-4">
            {albums.map((a, i) => (
              <div className="col-md-4 col-sm-6" key={i}>
                <div className="album-item overflow-hidden rounded-4 shadow-sm">
                  <img src={a.imageUrl} alt={a.alt || `Album ${i + 1}`}
                    className="img-fluid album-photo"
                    style={{ width: "100%", height: "600px", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                    onError={e => e.target.src = defaultA1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Khuyến mãi */}
      <section className="promo py-5 text-center">
        <div className="container">
          <h2 className="fw-bold">{promo.title || "🎉 Khuyến mãi đặc biệt"}</h2>
          <p>
            {promo.description || "Giảm ngay"}{" "}
            {promo.discount && <strong>{promo.discount}%</strong>}
            {" "}{promo.suffix || "cho dịch vụ uốn/nhuộm trong tháng này!"}
          </p>
        </div>
      </section>
    </div>
  );
}
