// src/App.jsx
import React, { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CategoryShop from "./pages/CategoryShop";
import ProductDetails from "./pages/ProductDetails";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import AddressForm from "./pages/AddressForm";
import MyOrders from "./pages/MyOrders";
import Loading from "./pages/Loading";

import Login from "./pages/Login";

import Sidebar from "./components/admin/Sidebar";
import AdminLogin from "./components/admin/AdminLogin";
import AddProduct from "./pages/admin/AddProduct";
import ProductList from "./pages/admin/ProductList";
import EditProduct from "./pages/admin/EditProduct";
import Orders from "./pages/admin/Orders";
import AccountPanel from "./pages/AccountPanel";
import AdminUsers from "./pages/admin/AdminUsers"; // ← import your AdminUsers page

import Header from "./components/Header";
import Footer from "./components/Footer";

import { ShopContext } from "./context/ShopContext";

const App = () => {
  const { showUserLogin, isAdmin } = useContext(ShopContext);
  const isAdminPath = useLocation().pathname.includes("/admin");

  return (
    <main>
      {showUserLogin && <Login />}

      {/* hide hdr/footer on all /admin routes */}
      {!isAdminPath && <Header />}

      <Toaster position="bottom-right" />

      <Routes>
        {/* Public/User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<CategoryShop />} />
        <Route path="/shop/:category/:id" element={<ProductDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address-form" element={<AddressForm />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/account" element={<AccountPanel />} />
        <Route path="/loader" element={<Loading />} />

        {/* Admin routes */}
        <Route path="/admin" element={isAdmin ? <Sidebar /> : <AdminLogin />}>
          {/* Dashboard = Add Product */}
          <Route index element={isAdmin ? <AddProduct /> : null} />

          {/* Product List */}
          <Route path="list" element={<ProductList />} />
          <Route path="list/:id/edit" element={<EditProduct />} />

          {/* Orders */}
          <Route path="orders" element={<Orders />} />

          {/* Users & Tickets */}
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={null} />
      </Routes>

      {!isAdminPath && <Footer />}
    </main>
  );
};

export default App;
