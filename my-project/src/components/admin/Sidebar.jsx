// src/components/admin/Sidebar.jsx
import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import {  FaListAlt, FaUsers, } from "react-icons/fa";
import { FaSquarePlus, FaBlog } from "react-icons/fa6"
import { MdFactCheck } from "react-icons/md";
import { BiLogOut, BiChevronLeft, BiChevronDown } from "react-icons/bi";
import toast from "react-hot-toast";
import adminImg from "../../assets/user.png";

const Sidebar = () => {
  const { axios } = useContext(ShopContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);

  const navItems = [
    { path: "/admin", label: "Add Item", icon: <FaSquarePlus /> },
    { path: "/admin/list", label: "List", icon: <FaListAlt /> },
    { path: "/admin/orders", label: "Orders", icon: <MdFactCheck /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/admin/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-[1440px] flex flex-col sm:flex-row">
      {/* Sidebar panel */}
      <div
        className={`
          bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dull)]
          backdrop-blur-md shadow-lg m-2 rounded-xl transition-all duration-300
          ${collapsed ? "sm:w-[80px]" : "sm:w-[250px]"} sm:min-h-[97vh]
          flex flex-col justify-between
        `}
      >
        <div>
          {/* Profile + Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img
                  src={adminImg}
                  alt="Admin"
                  className="w-10 h-10 rounded-full border-2 border-secondary"
                />
                <div>
                  <p className="font-bold text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1 rounded-full hover:bg-secondary/20 transition-transform
                ${collapsed ? "rotate-180" : ""}
              `}
            >
              <BiChevronLeft size={20} />
            </button>
          </div>

          {/* Main navigation */}
          <div className="mt-4">
            {!collapsed && (
              <p className="px-5 text-xs text-gray-500 uppercase mb-2">Main</p>
            )}
            <nav className="flex flex-col gap-1">
              {navItems.map(({ path, label, icon }) => (
                <NavLink
                  key={label}
                  to={path}
                  end={path === "/admin"}
                  className={({ isActive }) => `
                    relative flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-secondary text-white shadow-md border-l-4 border-tertiary"
                        : "hover:bg-secondary/10 text-gray-700"
                    }
                  `}
                >
                  <span className="text-lg">{icon}</span>
                  {!collapsed && <span>{label}</span>}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {label}
                    </span>
                  )}
                </NavLink>
              ))}

              {/* Blog section */}
              <div>
                <button
                  onClick={() => setBlogOpen(!blogOpen)}
                  className={`
                    relative flex items-center justify-between px-5 py-3 rounded-lg transition-all duration-200 group
                    hover:bg-secondary/10 text-gray-700
                  `}
                >
                  <span className="flex items-center gap-3">
                    <FaBlog className="text-lg" />
                    {!collapsed && <span>Blog</span>}
                  </span>
                  {!collapsed && (
                    <BiChevronDown
                      className={`
                        transition-transform duration-200
                        ${blogOpen ? "rotate-180" : ""}
                      `}
                    />
                  )}
                </button>

                <ul
                  className={`
                    pl-8 mt-1 space-y-1 overflow-hidden transition-all duration-200
                    ${blogOpen ? "max-h-40" : "max-h-0"}
                  `}
                >
                  <li>
                    <NavLink
                      to="/admin/posts"
                      end
                      className={({ isActive }) => `
                        relative block px-5 py-2 rounded-lg transition-colors duration-200 group
                        ${
                          isActive
                            ? "bg-secondary text-white"
                            : "hover:bg-secondary/10 text-gray-700"
                        }
                      `}
                    >
                      {!collapsed && "All Posts"}
                      {collapsed && (
                        <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100">
                          All Posts
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/posts/new"
                      className={({ isActive }) => `
                        relative block px-5 py-2 rounded-lg transition-colors duration-200 group
                        ${
                          isActive
                            ? "bg-secondary text-white"
                            : "hover:bg-secondary/10 text-gray-700"
                        }
                      `}
                    >
                      {!collapsed && "+ New Post"}
                      {collapsed && (
                        <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100">
                          New Post
                        </span>
                      )}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all w-full"
          >
            <BiLogOut className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
