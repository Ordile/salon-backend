import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AdminPanel.css";

export default function AdminContacts() {
  const [tab, setTab] = useState("appointment");
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== "ADMIN") { navigate("/"); return; }
    Promise.all([
      api.get("/appointment"),
      api.get("/contact"),
    ]).then(([a, c]) => {
      setAppointments(Array.isArray(a.data) ? a.data : []);
      setContacts(Array.isArray(c.data) ? c.data : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-panel container">
      <h1 className="page-title">📬 Lịch hẹn & Liên hệ</h1>

      <div className="admin-tabs" style={{ marginBottom: 24 }}>
        <button className={`admin-tab${tab === "appointment" ? " active" : ""}`} onClick={() => setTab("appointment")}>
          🗓️ Lịch hẹn ({appointments.length})
        </button>
        <button className={`admin-tab${tab === "contact" ? " active" : ""}`} onClick={() => setTab("contact")}>
          📩 Liên hệ ({contacts.length})
        </button>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <>
          {tab === "appointment" && (
            <div className="admin-table-wrap">
              {appointments.length === 0 ? <p>Chưa có lịch hẹn nào.</p> : (
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Họ tên</th><th>Điện thoại</th><th>Ngày giờ</th><th>Ghi chú</th></tr>
                  </thead>
                  <tbody>
                    {appointments.map((a, i) => (
                      <tr key={a.id}>
                        <td>{i + 1}</td>
                        <td>{a.name}</td>
                        <td>{a.phone}</td>
                        <td>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleString("vi-VN") : ""}</td>
                        <td>{a.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === "contact" && (
            <div className="admin-table-wrap">
              {contacts.length === 0 ? <p>Chưa có liên hệ nào.</p> : (
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Họ tên</th><th>Điện thoại</th><th>Email</th><th>Địa chỉ</th><th>Nội dung</th></tr>
                  </thead>
                  <tbody>
                    {contacts.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>{c.email || "—"}</td>
                        <td>{c.address || "—"}</td>
                        <td style={{ maxWidth: 260, wordBreak: "break-word" }}>{c.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
