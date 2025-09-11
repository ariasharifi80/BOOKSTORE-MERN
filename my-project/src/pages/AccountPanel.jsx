// src/pages/AccountPanel.jsx
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import MyOrders from "./MyOrders";
import toast from "react-hot-toast";

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
        toast.success("Profile Updated");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Update Failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Change Password failed");
    }
  };

  const handleFavoriteToggle = (id) => toggleFavorite(id);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    submitTicket({ subject, message });
    setSubject("");
    setMessage("");
  };

  const LABELS = ["Profile", "Password", "Orders", "Favorites", "Support"];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Account</h2>

      <div className="flex gap-6">
        {/* Left Sidebar */}
        <aside className="w-56 bg-white rounded-lg shadow p-4 sticky top-28 h-fit">
          {LABELS.map((lbl, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`block w-full text-left px-3 py-2 mb-2 rounded transition
                ${
                  tab === i
                    ? "bg-secondary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {lbl}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 transition-opacity duration-300 opacity-100">
          {tab === 0 && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  className="w-full p-2 border rounded focus:ring-secondary focus:border-secondary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring-secondary focus:border-secondary"
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
                  className="w-full p-2 border rounded focus:ring-secondary focus:border-secondary"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded focus:ring-secondary focus:border-secondary"
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
              <div className="-mt-23">
                <MyOrders orders={userOrders} />
              </div>
            </div>
          )}

          {tab === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userFavorites.length ? (
                userFavorites.map((b) => (
                  <div
                    key={b._id}
                    className="p-4 border rounded flex justify-between items-center"
                  >
                    <span>{b.name}</span>
                    <button
                      onClick={() => handleFavoriteToggle(b._id)}
                      className="text-red-500 hover:text-red-600"
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
            <>
              <form onSubmit={handleTicketSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block mb-1">Subject</label>
                  <input
                    className="w-full p-2 border rounded focus:ring-secondary focus:border-secondary"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Message</label>
                  <textarea
                    className="w-full p-2 border rounded focus:ring-secondary focus:border-secondary"
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

              {userTickets.length ? (
                <ul className="space-y-4">
                  {userTickets.map((t) => (
                    <li
                      key={t._id}
                      className="border rounded p-4 flex flex-col gap-2"
                    >
                      <p className="font-medium">{t.subject}</p>
                      <p className="text-sm text-gray-600">{t.message}</p>
                      <p className="text-xs text-gray-500">
                        Status:{" "}
                        <span className="font-semibold">{t.status}</span> •{" "}
                        {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No tickets submitted.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
