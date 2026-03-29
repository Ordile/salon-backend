import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import About from "./components/About";
import Footer from "./components/Footer";
import Appointment from "./components/Appointment";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Service from "./components/Service";
import NhuomToc from "./components/NhuomToc";
import UonToc from "./components/UonToc";
import TaoKieu from "./components/TaoKieu";
import CatTocNam from "./components/CatTocNam";
import Product from "./components/Product";
import ProductAdmin from "./components/ProductAdmin";
import Cart from "./components/Cart";
import MyOrders from "./components/MyOrders";
import AdminPromo from "./components/AdminPromo";
import AdminHomeContent from "./components/AdminHomeContent";
import AdminServiceDetail from "./components/AdminServiceDetail";
import AdminOrders from "./components/AdminOrders";
import AdminContacts from "./components/AdminContacts";
import AdminUsers from "./components/AdminUsers";
import { CartProvider } from "./CartContext";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Cart />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service" element={<Service />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/service/nhuom" element={<NhuomToc />} />
            <Route path="/service/uon" element={<UonToc />} />
            <Route path="/service/taokieu" element={<TaoKieu />} />
            <Route path="/service/catnam" element={<CatTocNam />} />
            <Route path="/product" element={<Product />} />
            <Route path="/admin/product" element={<ProductAdmin />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/promo" element={<AdminPromo />} />
            <Route path="/admin/home-content" element={<AdminHomeContent />} />
            <Route path="/admin/service-detail" element={<AdminServiceDetail />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Routes>
        </main>
        <Footer />
        <Appointment />
      </CartProvider>
    </BrowserRouter>
  );
}
