import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast-overlay">
      <div className={`toast-box toast-${toast.type}`}>
        <span className="toast-icon">
          {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "⚠"}
        </span>
        <span className="toast-msg">{toast.message}</span>
        {toast.type === "success" && <div className="toast-bar"><div className="toast-bar-fill" /></div>}
      </div>
    </div>
  );
}

// Màn hình quên mật khẩu
function ForgotPassword({ onBack }) {
  const [step, setStep] = useState("verify"); // "verify" | "reset"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", cb = null) => {
    setToast({ message, type });
    setTimeout(() => { setToast(null); if (cb) cb(); }, type === "success" ? 800 : 1200);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!username || !email) { showToast("Vui lòng nhập đầy đủ!", "warning"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { username, email });
      setLoading(false);
      showToast(res.data.message, "success", () => setStep("reset"));
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.message || "Xác minh thất bại!", "error");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPass || !confirmPass) { showToast("Vui lòng nhập đầy đủ!", "warning"); return; }
    if (newPass !== confirmPass) { showToast("Mật khẩu xác nhận không khớp!", "warning"); return; }
    if (newPass.length < 3) { showToast("Mật khẩu phải có ít nhất 3 ký tự!", "warning"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { username, email, newPassword: newPass });
      setLoading(false);
      showToast(res.data.message, "success", () => onBack());
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.message || "Đổi mật khẩu thất bại!", "error");
    }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ whiteSpace: "nowrap" }}>{step === "verify" ? "🔑 Quên mật khẩu" : "🔒 Đặt mật khẩu mới"}</h2>

          {step === "verify" ? (
            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input type="text" placeholder="Nhập tên đăng nhập" value={username}
                  onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email đã đăng ký</label>
                <input type="email" placeholder="Nhập email" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Đang xác minh..." : "Xác minh →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset}>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input type="password" placeholder="Nhập mật khẩu mới" value={newPass}
                  onChange={e => setNewPass(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} required />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Đang lưu..." : "Đổi mật khẩu ✓"}
              </button>
            </form>
          )}

          <p className="switch-text">
            <span className="switch-link" onClick={onBack}>← Quay lại đăng nhập</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const navigate = useNavigate();

  if (isForgot) return <ForgotPassword onBack={() => setIsForgot(false)} />;

  const showToast = (message, type = "success", callback = null) => {
    setToast({ message, type });
    const delay = type === "success" ? 500 : 1000;
    setTimeout(() => { setToast(null); if (callback) callback(); }, delay);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) nextRef.current.focus();
      else handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const username = usernameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    if (!username || !password) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "warning");
      setLoading(false); return;
    }
    if (!isLogin) {
      const confirm = confirmRef.current?.value.trim();
      if (password !== confirm) {
        showToast("Mật khẩu xác nhận không trùng khớp!", "warning");
        setLoading(false); return;
      }
    }

    const data = isLogin ? { username, password } : { username, email, password };
    const url = isLogin ? "http://localhost:8080/api/auth/login" : "http://localhost:8080/api/auth/register";

    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      let result = {};
      try { result = await res.json(); } catch { result = {}; }
      setLoading(false);

      if (res.ok) {
        if (isLogin) {
          const token = result.token || result.jwt || result.accessToken || "";
          const role = result.role || "USER";
          sessionStorage.setItem("user", JSON.stringify({ username: result.username || username, role, token }));
          sessionStorage.setItem("token", token);
          showToast("Đăng nhập thành công!", "success", () => navigate(role === "ADMIN" ? "/admin/product" : "/"));
        } else {
          showToast("Đăng ký thành công! Hãy đăng nhập.", "success", () => setIsLogin(true));
        }
      } else {
        showToast(result.message || "Sai thông tin đăng nhập", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Không thể kết nối tới server!", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="login-container">
        <div className="login-box">
          <h2>{isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input type="text" placeholder="Nhập tên đăng nhập" ref={usernameRef}
                onKeyDown={e => isLogin ? handleKeyDown(e, passwordRef) : handleKeyDown(e, emailRef)} required />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Nhập email" ref={emailRef}
                  onKeyDown={e => handleKeyDown(e, passwordRef)} required />
              </div>
            )}
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" placeholder="Nhập mật khẩu" ref={passwordRef}
                onKeyDown={e => !isLogin ? handleKeyDown(e, confirmRef) : handleKeyDown(e, null)} required />
              {isLogin && (
                <span className="forgot-link" onClick={() => setIsForgot(true)}>Quên mật khẩu?</span>
              )}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu" ref={confirmRef}
                  onKeyDown={e => handleKeyDown(e, null)} required />
              </div>
            )}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>
          <p className="switch-text">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
