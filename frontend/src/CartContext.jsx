import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "./api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const getUser = () => {
    const s = sessionStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  };

  const fetchCart = useCallback(async () => {
    if (!getUser()) { setCartItems([]); return; }
    try {
      const res = await api.get("/cart");
      setCartItems(res.data);
    } catch { setCartItems([]); }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId) => {
    if (!getUser()) return false; // chưa đăng nhập
    await api.post("/cart/add", { productId, quantity: 1 });
    await fetchCart();
    return true;
  };

  const updateQty = async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity });
    } catch (err) {
      // 404 = item không còn tồn tại, refresh lại giỏ
      if (err?.response?.status === 404) console.warn("Cart item not found, refreshing...");
      else throw err;
    }
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
    } catch (err) {
      if (err?.response?.status === 404) console.warn("Cart item not found, refreshing...");
      else throw err;
    }
    await fetchCart();
  };

  const checkout = async (paymentMethod, shippingAddress) => {
    const res = await api.post("/cart/checkout", { paymentMethod, shippingAddress });
    // Fetch cart riêng, không throw nếu lỗi
    fetchCart().catch(() => setCartItems([]));
    return res.data;
  };

  const totalCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = cartItems.reduce((s, i) => s + i.productPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartOpen, setCartOpen,
      addToCart, updateQty, removeItem, checkout,
      totalCount, totalAmount, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
