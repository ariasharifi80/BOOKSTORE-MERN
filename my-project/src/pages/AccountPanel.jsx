// src/pages/AccountPanel.jsx
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import MyOrders from "./MyOrders";

const AccountPanel = () => {
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

  // 0=Profile, 1=Password, 2=Orders, 3=Favorites, 4=Support
  const [tab, setTab] = useState(0);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Support ticket form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Initialize profile fields
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Fetch data when switching tabs
  useEffect(() => {
    if (tab === 2) fetchUserOrders();
    if (tab === 3) fetchUserFavorites();
    if (tab === 4) fetchUserTickets();
  }, [tab]);

  // Handlers
  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    changePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleFavoriteToggle = (bookId) => {
    toggleFavorite(bookId);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    submitTicket({ subject, message });
    setSubject("");
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Account</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["Profile", "Password", "Orders", "Favorites", "Support"].map(
          (label, idx) => (
            <button
              key={idx}
              onClick={() => setTab(idx)}
              className={`flex-1 py-2 text-center ${
                tab === idx
                  ? "border-b-2 border-secondary font-medium"
                  : "text-gray-600"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {/* Tab Content */}
      {tab === 0 && (
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-secondary">
            Save Profile
          </button>
        </form>
      )}

      {tab === 1 && (
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block mb-1">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-secondary">
            Change Password
          </button>
        </form>
      )}

      {tab === 2 && (
        <div className="space-y-4">
          <MyOrders />
        </div>
      )}

      {tab === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userFavorites && userFavorites.length ? (
            userFavorites.map((book) => (
              <div
                key={book._id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <span>{book.name}</span>
                <button
                  onClick={() => handleFavoriteToggle(book._id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No favorites yet.</p>
          )}
        </div>
      )}

      {tab === 4 && (
        <div>
          {/* New Ticket Form */}
          <form onSubmit={handleTicketSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block mb-1">Subject</label>
              <input
                className="w-full p-2 border rounded"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Message</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-secondary">
              Submit Ticket
            </button>
          </form>

          {/* List of Past Tickets */}
          {userTickets && userTickets.length ? (
            <ul className="space-y-4">
              {userTickets.map((t) => (
                <li
                  key={t._id}
                  className="border rounded p-4 flex flex-col gap-2"
                >
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-sm text-gray-600">{t.message}</p>
                  <p className="text-xs text-gray-500">
                    Status: <span className="font-semibold">{t.status}</span> •{" "}
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tickets submitted.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPanel;
