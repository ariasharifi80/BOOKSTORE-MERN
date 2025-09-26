/* eslint-disable no-unused-vars */
// src/pages/AccountPanel.jsx
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import MyOrders from "./MyOrders";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaShoppingBag,
  FaHeart,
  FaHeadset,
} from "react-icons/fa";

export default function AccountPanel() {
  const {
    user,
    updateProfile,
    changePassword,
    userOrders,
    fetchUserOrders,
    userFavorites,
    fetchUserFavorites,
    toggleFavorite,
    userTickets,
    fetchUserTickets,
    submitTicket,
  } = useContext(ShopContext);

  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (tab === 2) fetchUserOrders();
    if (tab === 3) fetchUserFavorites();
    if (tab === 4) fetchUserTickets();
  }, [tab]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ name, email });
      if (res.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Password change failed");
    }
  };

  const handleFavoriteToggle = (id) => toggleFavorite(id);
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    submitTicket({ subject, message });
    setSubject("");
    setMessage("");
    toast.success("Support ticket submitted!");
  };

  const TABS = [
    { id: 0, label: "Profile", icon: <FaUser /> },
    { id: 1, label: "Password", icon: <FaLock /> },
    { id: 2, label: "Orders", icon: <FaShoppingBag /> },
    { id: 3, label: "Favorites", icon: <FaHeart /> },
    { id: 4, label: "Support", icon: <FaHeadset /> },
  ];

  // Reusable input component
  const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    required = true,
    placeholder,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
      />
    </div>
  );

  // Reusable textarea component
  const TextAreaField = ({
    label,
    value,
    onChange,
    required = true,
    placeholder,
    rows = 4,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
      />
    </div>
  );

  // Reusable button component
  const SubmitButton = ({ children, onClick, type = "submit" }) => (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-secondary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile, orders, and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Modern Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-2">
              {TABS.map((tabItem) => (
                <motion.button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mb-1 ${
                    tab === tabItem.id
                      ? "bg-secondary text-white shadow-md"
                      : "text-gray-700 hover:bg-secondary/50 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span
                    className={`text-lg ${tab === tabItem.id ? "text-white" : "text-gray-500"}`}
                  >
                    {tabItem.icon}
                  </span>
                  <span className="font-medium">{tabItem.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              {/* Profile Tab */}
              {tab === 0 && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <InputField
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                    <SubmitButton>Save Changes</SubmitButton>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {tab === 1 && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Change Password
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <InputField
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                    <InputField
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                    />
                    <SubmitButton>Update Password</SubmitButton>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {tab === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Orders
                  </h2>
                  <div className="-mx-6 -mt-6">
                    <MyOrders orders={userOrders} />
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {tab === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Favorites
                  </h2>
                  {userFavorites.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userFavorites.map((book) => (
                        <motion.div
                          key={book._id}
                          className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={book.image?.[0] || "/placeholder-book.jpg"}
                              alt={book.name}
                              className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-900 line-clamp-1">
                                {book.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                by {book.author}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFavoriteToggle(book._id)}
                            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                            aria-label="Remove from favorites"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">❤️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-gray-600">
                        Start adding books to your favorites to see them here!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Support Tab */}
              {tab === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Support & Help
                  </h2>

                  {/* Submit Ticket Form */}
                  <div className="bg-white rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Submit a Support Ticket
                    </h3>
                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                      <InputField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What is your issue about?"
                      />
                      <TextAreaField
                        label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your issue in detail..."
                      />
                      <SubmitButton>Submit Ticket</SubmitButton>
                    </form>
                  </div>

                  {/* Previous Tickets */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Your Support Tickets
                    </h3>
                    {userTickets.length ? (
                      <div className="space-y-4">
                        {userTickets.map((ticket) => (
                          <motion.div
                            key={ticket._id}
                            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-900">
                                {ticket.subject}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  ticket.status === "open"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">
                              {ticket.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted on{" "}
                              {new Date(ticket.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">🎫</div>
                        <p className="text-gray-600">
                          You haven't submitted any support tickets yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
