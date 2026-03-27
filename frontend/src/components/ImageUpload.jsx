import { useState } from "react";
import api from "../api";
import "./ImageUpload.css";

export default function ImageUpload({ value, onChange, label = "Ảnh" }) {
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Preview ngay
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Upload
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onChange(res.data.url);
    } catch {
      alert("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="img-upload">
      <label className="img-upload-label">{label}</label>
      <div className="img-upload-area">
        {preview && (
          <div className="img-preview-wrap">
            <img src={preview} alt="preview" className="img-preview" />
            <button type="button" className="img-remove-btn" onClick={() => {
              setPreview("");
              onChange("");
            }}>✕</button>
          </div>
        )}
        <label className="img-upload-btn">
          {uploading ? "Đang tải..." : preview ? "Đổi ảnh" : "Chọn ảnh từ máy"}
          <input type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
      </div>
    </div>
  );
}
