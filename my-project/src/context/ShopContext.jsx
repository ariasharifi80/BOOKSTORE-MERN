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
  const [userFavorites, setUserFavorites] = useState([]);
  const [userTickets, setUserTickets] = useState([]);

  const [orders, setOrders] = useState([]);

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

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const book = books.find((b) => b._id === id);
      return book ? sum + book.offerPrice * qty : sum;
    }, 0);
  };

  const fetchUserOrders = async () => {
    try {
      const { data } = await axios.post("/api/order/userorders");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
  //FAVORITE SECTION
  const fetchUserFavorites = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites");
      console.log("🔎 GET favorites →", data.favorites);

      if (data.success) {
        setUserFavorites(data.favorites);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const toggleFavorite = async (bookId) => {
    try {
      const { data } = await axios.post(`/api/user/favorites/${bookId}`);
      if (data.success) {
        // Determine if it was added or removed
        const wasAdded = data.favorites.some((fav) => fav._id === bookId);
        setUserFavorites(data.favorites);

        toast.success(
          wasAdded ? "❤️ Added to favorites" : "💔 Removed from favorites",
          { autoClose: 1500 },
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //TICKET SECTIONS

  const fetchUserTickets = async () => {
    try {
      const { data } = await axios.get("/api/user/tickets");

      if (data.success) {
        setUserTickets(data.tickets);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submitTicket = async ({ subject, message }) => {
    try {
      const { data } = await axios.post("/api/user/ticket", {
        subject,
        message,
      });
      if (data.success) {
        setUserTickets((prev) => [data.ticket, ...prev]);
        toast.success("Ticket submitted");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateProfile = async ({ name, email }) => {
    try {
      const { data } = await axios.put("/api/user/update", { name, email });
      if (data.success) {
        toast.success("Profile Updated");
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
      return data;
    } catch (err) {
      const error = err.response?.data || { message: err.message };
      toast.error(error.message);
      throw error;
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const { data } = await axios.put("/api/user/change-password", {
        currentPassword,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      return data; // { success, message }
    } catch (err) {
      const error = err.response?.data || { message: err.message };
      toast.error(error.message);
      throw error;
    }
  };

  const verifyEmail = async ({ email, code }) => {
    const { data } = await axios.post("/api/user/verify-email", {
      email,
      code,
    });
    return data;
  };

  const resendCode = async ({ email }) => {
    const { data } = await axios.post("/api/user/resend-code", { email });
    return data;
  };
  // ── BLOG HELPERS ────────────────────────────────────────────────────────

  // 1. List posts (with optional pagination)
  const fetchPosts = async ({ page = 1, limit = 10, status = "" } = {}) => {
    try {
      const { data } = await axios.get("/api/posts", {
        params: { page, limit, status },
      });
      if (data.success) return data;
      throw new Error(data.message);
    } catch (err) {
      toast.error(err.message);
      return { success: false, posts: [], count: 0 };
    }
  };

  // 2. Get a single post by slug
  const fetchPostBySlug = async (slug) => {
    try {
      const { data } = await axios.get(`/api/posts/${slug}`);
      if (data.success) return data.post;
      throw new Error(data.message);
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  };

  // 3. Create a new post (admin)
  const createPost = async ({ postData, coverImageFile }) => {
    console.log("📤 createPost helper – postData:", postData);
    console.log("📤 createPost helper – coverImageFile:", coverImageFile);
    try {
      const formData = new FormData();
      formData.append("postData", JSON.stringify(postData));
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const { data } = await axios.post("/api/posts", formData);
      if (data.success) toast.success("Post created");
      else throw new Error(data.message);
      return data.post;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  // 4. Update an existing post
  const updatePost = async ({ id, postData, coverImageFile }) => {
    try {
      const formData = new FormData();
      formData.append("postData", JSON.stringify(postData));
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const { data } = await axios.put(`/api/posts/${id}`, formData);
      if (data.success) toast.success("Post updated");
      else throw new Error(data.message);
      return data.post;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  // 5. Delete a post
  const deletePost = async (id) => {
    try {
      const { data } = await axios.delete(`/api/posts/${id}`);
      if (data.success) toast.success("Post deleted");
      else throw new Error(data.message);
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
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
    userFavorites,
    fetchUserFavorites,
    toggleFavorite,
    fetchUserOrders,
    userTickets,
    fetchUserTickets,
    submitTicket,
    orders,
    setOrders,
    updateProfile,
    changePassword,
    verifyEmail,
    resendCode,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
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
