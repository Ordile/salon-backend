import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AdminPanel.css";

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? "#c0392b" : type === "warning" ? "#e67e22" : "#2e7d32",
      color: "#fff", padding: "12px 28px", borderRadius: 10,
      fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
    }}>{msg}</div>
  );
}

function ConfirmModal({ msg, onOk, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998
    }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", minWidth: 300, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <p style={{ marginBottom: 20, fontSize: 15 }}>{msg}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onOk} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: 8, padding: "8px 24px", cursor: "pointer", fontWeight: 600 }}>Xóa</button>
          <button onClick={onCancel} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "8px 24px", cursor: "pointer", fontWeight: 600 }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { username: "", email: "", address: "", role: "USER", password: "" };

function UserModal({ initial, onSave, onClose, isNew }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998
    }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", minWidth: 340, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <h3 style={{ marginBottom: 18 }}>{isNew ? "➕ Thêm người dùng" : "✏️ Sửa người dùng"}</h3>
        {isNew && (
          <>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Tên đăng nhập *</label>
            <input value={form.username} onChange={e => set("username", e.target.value)}
              placeholder="username" style={inputStyle} />
            <label style={{ fontSize: 13, fontWeight: 600 }}>Mật khẩu *</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
              placeholder="Mật khẩu" style={inputStyle} />
          </>
        )}
        <label style={{ fontSize: 13, fontWeight: 600 }}>Email</label>
        <input value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="email@example.com" style={inputStyle} />
        <label style={{ fontSize: 13, fontWeight: 600 }}>Địa chỉ</label>
        <input value={form.address} onChange={e => set("address", e.target.value)}
          placeholder="Địa chỉ" style={inputStyle} />
        <label style={{ fontSize: 13, fontWeight: 600 }}>Vai trò</label>
        <select value={form.role} onChange={e => set("role", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="USER">Khách hàng</option>
          <option value="ADMIN">Admin</option>
        </select>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button onClick={() => onSave(form)}
            style={{ background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "8px 22px", cursor: "pointer", fontWeight: 600 }}>
            Lưu
          </button>
          <button onClick={onClose}
            style={{ background: "#eee", border: "none", borderRadius: 8, padding: "8px 22px", cursor: "pointer", fontWeight: 600 }}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block", width: "100%", padding: "8px 12px", borderRadius: 8,
  border: "1px solid #ccc", fontSize: 14, marginBottom: 12, boxSizing: "border-box"
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null); // { id, username }
  const [editUser, setEditUser] = useState(null); // user object
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const me = JSON.parse(sessionStorage.getItem("user") || "null");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!me || me.role !== "ADMIN") { navigate("/"); return; }
    api.get("/admin/users")
      .then(r => setUsers(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortIcon = (field) => sortField !== field ? " ↕" : sortDir === "asc" ? " ↑" : " ↓";

  const handleDelete = (id, username) => setConfirm({ id, username });

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/users/${confirm.id}`);
      setUsers(prev => prev.filter(u => u.id !== confirm.id));
      showToast("Đã xóa tài khoản!");
    } catch { showToast("Xóa thất bại!", "error"); }
    setConfirm(null);
  };

  const handleEdit = (u) => {
    setEditUser({ id: u.id, username: u.username, email: u.email, address: u.address, role: u.roles?.[0] || "USER" });
  };

  const handleSaveEdit = async (form) => {
    try {
      const res = await api.put(`/admin/users/${editUser.id}`, { email: form.email, address: form.address, role: form.role });
      setUsers(prev => prev.map(u => u.id === editUser.id ? res.data : u));
      showToast("Đã cập nhật!");
      setEditUser(null);
    } catch (err) {
      showToast(err.response?.data || "Cập nhật thất bại!", "error");
    }
  };

  const handleAdd = async (form) => {
    if (!form.username) { showToast("Vui lòng nhập tên đăng nhập!", "warning"); return; }
    if (!form.password) { showToast("Vui lòng nhập mật khẩu!", "warning"); return; }
    try {
      const res = await api.post("/admin/users", form);
      setUsers(prev => [...prev, res.data]);
      showToast("Đã thêm người dùng!");
      setShowAdd(false);
    } catch (err) {
      showToast(err.response?.data || "Thêm thất bại!", "error");
    }
  };

  // Tìm email chỉ theo phần trước @
  const emailMatch = (email, q) => {
    const local = (email || "").split("@")[0].toLowerCase();
    return local.includes(q.toLowerCase());
  };

  const filtered = users
    .filter(u =>
      (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
      emailMatch(u.email, search) ||
      (u.address || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const va = (a[sortField] || "").toString().toLowerCase();
      const vb = (b[sortField] || "").toString().toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const customers = filtered.filter(u => !u.roles?.includes("ADMIN"));
  const admins = filtered.filter(u => u.roles?.includes("ADMIN"));

  return (
    <div className="admin-panel container">
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {confirm && <ConfirmModal msg={`Xóa tài khoản "${confirm.username}"?`} onOk={confirmDelete} onCancel={() => setConfirm(null)} />}
      {editUser && <UserModal initial={editUser} onSave={handleSaveEdit} onClose={() => setEditUser(null)} isNew={false} />}
      {showAdd && <UserModal initial={EMPTY_FORM} onSave={handleAdd} onClose={() => setShowAdd(false)} isNew={true} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <h1 className="page-title" style={{ margin: 0 }}>👥 Quản lý khách hàng</h1>
        <button onClick={() => setShowAdd(true)}
          style={{ background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          + Thêm người dùng
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, email (trước @), địa chỉ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 14, minWidth: 280, flex: 1, maxWidth: 420 }}
        />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer", background: "#f5f5f5" }}>
            ✕ Xóa
          </button>
        )}
        <span style={{ fontSize: 13, color: "#888" }}>{filtered.length} tài khoản</span>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <div className="admin-table-wrap">
          {filtered.length === 0 ? <p>Không tìm thấy kết quả.</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th onClick={() => handleSort("username")} style={{ cursor: "pointer" }}>Tên đăng nhập{sortIcon("username")}</th>
                  <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>Email{sortIcon("email")}</th>
                  <th onClick={() => handleSort("address")} style={{ cursor: "pointer" }}>Địa chỉ{sortIcon("address")}</th>
                  <th>Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.email || "—"}</td>
                    <td>{u.address || "—"}</td>
                    <td><span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>Khách hàng</span></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(u)}
                        style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(u.id, u.username)}
                        style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {admins.map((u, i) => (
                  <tr key={u.id} style={{ background: "#fff8e1" }}>
                    <td>{customers.length + i + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.email || "—"}</td>
                    <td>{u.address || "—"}</td>
                    <td><span style={{ background: "#fff3e0", color: "#e65100", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>Admin</span></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(u)}
                        style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>
                        Sửa
                      </button>
                      <span style={{ color: "#aaa", fontSize: 13, alignSelf: "center" }}>—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
