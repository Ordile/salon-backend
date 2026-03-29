import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AdminPanel.css";

export default function AdminContacts() {
  const [tab, setTab] = useState("appointment");
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");
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

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const sortIcon = (field) => {
    if (sortField !== field) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const applyFilter = (list, fields) => {
    let result = list.filter(item =>
      fields.some(f => (item[f] || "").toString().toLowerCase().includes(search.toLowerCase()))
    );
    if (sortField) {
      result = [...result].sort((a, b) => {
        const va = (a[sortField] || "").toString().toLowerCase();
        const vb = (b[sortField] || "").toString().toLowerCase();
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return result;
  };

  const filteredAppointments = applyFilter(appointments, ["name", "phone", "note"]);
  const filteredContacts = applyFilter(contacts, ["name", "phone", "email", "address", "message"]);

  const handleTabChange = (t) => { setTab(t); setSearch(""); setSortField(""); setSortDir("asc"); };

  return (
    <div className="admin-panel container">
      <h1 className="page-title">📬 Lịch hẹn & Liên hệ</h1>

      <div className="admin-tabs" style={{ marginBottom: 16 }}>
        <button className={`admin-tab${tab === "appointment" ? " active" : ""}`} onClick={() => handleTabChange("appointment")}>
          🗓️ Lịch hẹn ({appointments.length})
        </button>
        <button className={`admin-tab${tab === "contact" ? " active" : ""}`} onClick={() => handleTabChange("contact")}>
          📩 Liên hệ ({contacts.length})
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder={tab === "appointment" ? "🔍 Tìm theo tên, SĐT, ghi chú..." : "🔍 Tìm theo tên, SĐT, email, nội dung..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1px solid #ccc",
            fontSize: 14, minWidth: 280, flex: 1, maxWidth: 420
          }}
        />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer", background: "#f5f5f5" }}>
            ✕ Xóa
          </button>
        )}
        <span style={{ fontSize: 13, color: "#888" }}>
          {tab === "appointment" ? filteredAppointments.length : filteredContacts.length} kết quả
        </span>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <>
          {tab === "appointment" && (
            <div className="admin-table-wrap">
              {filteredAppointments.length === 0 ? <p>Không tìm thấy kết quả.</p> : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>Họ tên{sortIcon("name")}</th>
                      <th onClick={() => handleSort("phone")} style={{ cursor: "pointer" }}>Điện thoại{sortIcon("phone")}</th>
                      <th onClick={() => handleSort("appointmentDate")} style={{ cursor: "pointer" }}>Ngày giờ{sortIcon("appointmentDate")}</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((a, i) => (
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
              {filteredContacts.length === 0 ? <p>Không tìm thấy kết quả.</p> : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>Họ tên{sortIcon("name")}</th>
                      <th onClick={() => handleSort("phone")} style={{ cursor: "pointer" }}>Điện thoại{sortIcon("phone")}</th>
                      <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>Email{sortIcon("email")}</th>
                      <th>Địa chỉ</th>
                      <th>Nội dung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c, i) => (
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
