import { useEffect, useState } from "react";
import api from "../api";
import "./ServiceDetail.css";

// Default data cho từng loại dịch vụ
const DEFAULTS = {
  nhuom: {
    banner: { title: "Dịch Vụ Nhuộm Tóc", description: "Thay đổi phong cách với màu tóc thời thượng, an toàn và bền đẹp." },
    intro: { heading: "Vì sao chọn dịch vụ nhuộm tóc tại Salon TORO?", text: "Tại Salon TORO, chúng tôi chỉ sử dụng thuốc nhuộm nhập khẩu chính hãng từ Ý, Nhật và Hàn Quốc." },
    items: [
      { imageUrl: require("../assets/a3.jpg"), title: "" },
      { imageUrl: require("../assets/a8.jpg"), title: "" },
      { imageUrl: require("../assets/a7.jpg"), title: "" },
      { imageUrl: require("../assets/a4.jpg"), title: "" },
    ],
    prices: [
      { label: "Nhuộm toàn đầu", price: "400.000đ – 700.000đ" },
      { label: "Nhuộm highlight / ombre", price: "700.000đ – 1.200.000đ" },
      { label: "Nhuộm phủ bóng – phục hồi", price: "900.000đ+" },
    ],
  },
  uon: {
    banner: { title: "Dịch Vụ Uốn Tóc", description: "Tóc xoăn bồng bềnh, mềm mại và giữ nếp lâu dài với kỹ thuật hiện đại." },
    intro: { heading: "Uốn tóc tại Salon TORO có gì đặc biệt?", text: "Chúng tôi sử dụng công nghệ uốn lạnh – uốn nóng cao cấp từ Nhật Bản." },
    items: [
      { imageUrl: require("../assets/a1.jpg"), title: "" },
      { imageUrl: require("../assets/a5.jpg"), title: "" },
      { imageUrl: require("../assets/a9.jpg"), title: "" },
      { imageUrl: require("../assets/a11.jpg"), title: "" },
    ],
    prices: [
      { label: "Uốn lạnh", price: "600.000đ – 900.000đ" },
      { label: "Uốn nóng", price: "900.000đ – 1.400.000đ" },
      { label: "Uốn phục hồi / collagen", price: "1.200.000đ+" },
    ],
  },
  taokieu: {
    banner: { title: "Dịch Vụ Tạo Kiểu Tóc", description: "Khẳng định cá tính – Tỏa sáng phong cách – Phù hợp mọi dịp." },
    intro: { heading: "Tạo kiểu chuyên nghiệp tại Salon TORO", text: "Dù là đi tiệc, sự kiện hay chỉ muốn thay đổi nhẹ nhàng cho ngày mới." },
    items: [
      { imageUrl: require("../assets/a8.jpg"), title: "" },
      { imageUrl: require("../assets/a5.jpg"), title: "" },
      { imageUrl: require("../assets/service/t7.jpg"), title: "" },
      { imageUrl: require("../assets/service/t10.jpg"), title: "" },
    ],
    prices: [
      { label: "Sấy tạo kiểu", price: "80.000đ – 150.000đ" },
      { label: "Tạo kiểu uốn / xoăn tạm thời", price: "200.000đ+" },
      { label: "Tạo kiểu dự tiệc / sự kiện", price: "300.000đ+" },
    ],
  },
  catnam: {
    banner: { title: "Dịch Vụ Cắt Tóc Nam", description: "Đẳng cấp – Tỉ mỉ – Thời thượng. Kiểu tóc thể hiện phong cách của bạn." },
    intro: { heading: "Salon TORO – Nơi khẳng định phong cách phái mạnh", text: "Với đội ngũ barber chuyên nghiệp, chúng tôi mang đến kiểu tóc gọn gàng, nam tính." },
    items: [
      { imageUrl: require("../assets/a10.jpg"), title: "" },
      { imageUrl: require("../assets/service/t7.png"), title: "" },
      { imageUrl: require("../assets/service/t8.png"), title: "" },
    ],
    prices: [
      { label: "Cắt tóc nam cơ bản", price: "100.000đ" },
      { label: "Cắt + gội đầu", price: "150.000đ" },
      { label: "Combo cắt + uốn / nhuộm nhẹ", price: "350.000đ+" },
    ],
  },
};

export default function ServiceDetailPage({ category }) {
  const def = DEFAULTS[category] || DEFAULTS.nhuom;
  const [banner, setBanner] = useState(def.banner);
  const [items, setItems] = useState(def.items);
  const [prices, setPrices] = useState(def.prices);
  const [intro] = useState(def.intro);

  useEffect(() => {
    api.get(`/service-detail/${category}`).then(r => {
      const d = r.data;
      if (!d || typeof d !== "object" || Array.isArray(d)) return;
      if (d.banner?.title) setBanner(d.banner);
      if (Array.isArray(d.items) && d.items.length > 0) setItems(d.items);
      if (Array.isArray(d.prices) && d.prices.length > 0) setPrices(d.prices);
    }).catch(() => {});
  }, [category]);

  return (
    <div className="service-detail">
      <section className="service-banner">
        <h1>{banner.title}</h1>
        <p>{banner.description}</p>
      </section>

      <section className="content container">
        <h2>{intro.heading}</h2>
        <p>{intro.text}</p>

        <div className="image-row">
          {items.map((item, i) => (
            <img key={i} src={item.imageUrl} alt={item.title || `Ảnh ${i + 1}`}
              onError={e => e.target.style.display = "none"} />
          ))}
        </div>

        <h3>Bảng giá tham khảo</h3>
        <ul className="price-list">
          {prices.map((p, i) => (
            <li key={i}>{p.label}: <strong>{p.price}</strong></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
