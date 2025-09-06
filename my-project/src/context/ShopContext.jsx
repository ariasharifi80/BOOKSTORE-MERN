import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const currency = import.meta.env.VITE_CURRENCY;
  const [cartItems, setCartItems] = useState({});
  const [method, setMethod] = useState("COD");
  const [showUserLogin, setShowUserLogin] = useState("");
  const delivery_charges = 10; // 10$ dollars
  const [isAdmin, setIsAdmin] = useState(false);

  //Fetch All Books

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setBooks(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch Admin
  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      setIsAdmin(data.success);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  //Adding Items To Cart

  const addToCart = (itemId) => {
    const cartData = { ...cartItems }; //Use shallow copy

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
  };

  // Getting Total Cart Items

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      try {
        if (cartItems[itemId] > 0) {
          totalCount += cartItems[itemId];
        }
      } catch (error) {
        console.log(error);
      }
    }
    return totalCount;
  };

  // Update the quantity

  const updateQuantity = (itemId, quantity) => {
    const cartData = { ...cartItems };
    cartData[itemId] = quantity;
    setCartItems(cartData);
  };

  //Getting total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        let itemInfo = books.find((book) => book._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    fetchBooks();
    fetchAdmin();
  }, []);

  const value = {
    books,
    navigate,
    user,
    setUser,
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
    axios,
    fetchBooks,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
