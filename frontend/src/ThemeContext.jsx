import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Theo dõi system preference — chỉ áp dụng khi chưa có lựa chọn thủ công
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      // Lưu lựa chọn thủ công
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // Nút reset về auto (theo system) — gọi khi cần
  const resetToSystem = () => {
    localStorage.removeItem("theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(sysDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, resetToSystem }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
