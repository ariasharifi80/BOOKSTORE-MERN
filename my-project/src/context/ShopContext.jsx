// src/context/ShopContext.jsx
/* eslint-disable no-unused-vars */
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Axios defaults: include cookies & use your backend URL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // ── EXISTING STATE ─────────────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const currency = import.meta.env.VITE_CURRENCY;
  const [cartItems, setCartItems] = useState({});
  const [method, setMethod] = useState("COD");
  const [showUserLogin, setShowUserLogin] = useState(false);
  const delivery_charges = 10;
  const [isAdmin, setIsAdmin] = useState(false);

  // ── ADMIN STATE ────────────────────────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTickets, setAdminTickets] = useState({});
  const [adminLoading, setAdminLoading] = useState(false);

  // ── EXISTING HELPERS ────────────────────────────────────────────────────
  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setBooks(data.products);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartData || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch {
      setUser(null);
      setCartItems({});
    }
  };

  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      setIsAdmin(data.success);
    } catch {
      setIsAdmin(false);
    }
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.post("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        setCartItems({});
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addToCart = async (itemId) => {
    const copy = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(copy);
    if (user) {
      try {
        const { data } = await axios.post("/api/cart/add", { itemId });
        data.success ? toast.success(data.message) : toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const updateQuantity = async (itemId, quantity) => {
    const copy = { ...cartItems };
    if (quantity <= 0) delete copy[itemId];
    else copy[itemId] = quantity;
    setCartItems(copy);

    if (user) {
      try {
        const { data } = await axios.post("/api/cart/update", {
          itemId,
          quantity,
        });
        data.success ? toast.success(data.message) : toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const book = books.find((b) => b._id === id);
      return book ? sum + book.offerPrice * qty : sum;
    }, 0);

  // ── ADMIN HELPERS ───────────────────────────────────────────────────────

  // 1. Fetch all users
  const fetchAdminUsers = async () => {
    setAdminLoading(true);
    console.log("📡 [Admin] fetching users...");
    try {
      const { data } = await axios.get("/api/admin/users");
      console.log("📥 [Admin] users response:", data);
      if (data.success) setAdminUsers(data.users);
      else toast.error(data.message);
    } catch (err) {
      console.error("🚨 fetchAdminUsers error:", err);
      toast.error(err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  // 2. Delete a user
  const adminDeleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      console.log("📥 [Admin] deleteUser response:", data);
      if (data.success) {
        setAdminUsers((prev) => prev.filter((u) => u._id !== userId));
        setAdminTickets((prev) => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("🚨 adminDeleteUser error:", err);
      toast.error(err.message);
    }
  };

  // 3. Fetch tickets for a user
  const fetchAdminTickets = async (userId) => {
    if (adminTickets[userId]) return;
    try {
      const { data } = await axios.get(`/api/admin/users/${userId}/tickets`);
      console.log(`📥 [Admin] tickets for ${userId}:`, data);
      if (data.success) {
        setAdminTickets((prev) => ({ ...prev, [userId]: data.tickets }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("🚨 fetchAdminTickets error:", err);
      toast.error(err.message);
    }
  };

  // 4. Toggle ticket status
  const adminToggleTicketStatus = async (userId, ticketId, newStatus) => {
    try {
      const { data } = await axios.patch(`/api/admin/tickets/${ticketId}`, {
        status: newStatus,
      });
      console.log("📥 [Admin] updateStatus response:", data);
      if (data.success) {
        setAdminTickets((prev) => ({
          ...prev,
          [userId]: prev[userId].map((t) =>
            t._id === ticketId ? { ...t, status: newStatus } : t,
          ),
        }));
        toast.success("Ticket status updated");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("🚨 adminToggleTicketStatus error:", err);
      toast.error(err.message);
    }
  };

  // 5. Delete a ticket
  const adminDeleteTicket = async (userId, ticketId) => {
    try {
      const { data } = await axios.delete(`/api/admin/tickets/${ticketId}`);
      console.log("📥 [Admin] deleteTicket response:", data);
      if (data.success) {
        setAdminTickets((prev) => ({
          ...prev,
          [userId]: prev[userId].filter((t) => t._id !== ticketId),
        }));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("🚨 adminDeleteTicket error:", err);
      toast.error(err.message);
    }
  };

  // 6. Export tickets to CSV
  const adminExportTickets = (userId) => {
    const tickets = adminTickets[userId] || [];
    if (!tickets.length) {
      toast.error("No tickets to export");
      return;
    }

    const header = ["Subject", "Message", "Status", "Created At"];
    const rows = tickets.map((t) => [
      t.subject,
      t.message.replace(/\n/g, " "),
      t.status,
      new Date(t.createdAt).toLocaleString(),
    ]);

    const csv =
      [header, ...rows]
        .map((row) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
        )
        .join("\n") + "\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tickets_${userId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── INITIAL LOAD ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBooks();
    fetchUser();
    fetchAdmin();
  }, []);

  // ── CONTEXT VALUE ───────────────────────────────────────────────────────
  const value = {
    // existing exports
    books,
    navigate,
    user,
    setUser,
    fetchUser,
    currency,
    searchQuery,
    setSearchQuery,
    cartItems,
    setCartItems,
    addToCart,
    getCartAmount,
    getCartCount,
    updateQuantity,
    method,
    setMethod,
    delivery_charges,
    showUserLogin,
    setShowUserLogin,
    isAdmin,
    setIsAdmin,
    fetchBooks,
    logoutUser,
    // axios now exposed
    axios,
    // admin exports
    adminUsers,
    adminTickets,
    adminLoading,
    fetchAdminUsers,
    adminDeleteUser,
    fetchAdminTickets,
    adminToggleTicketStatus,
    adminDeleteTicket,
    adminExportTickets,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
