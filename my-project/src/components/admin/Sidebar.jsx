// src/components/admin/Sidebar.jsx
import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { FaSquarePlus } from "react-icons/fa6";
import { FaListAlt, FaUsers } from "react-icons/fa";
import { MdFactCheck } from "react-icons/md";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BiLogOut, BiChevronLeft } from "react-icons/bi";
import toast from "react-hot-toast";
import adminImg from "../../assets/user.png";

const Sidebar = () => {
  const { axios } = useContext(ShopContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/admin", label: "Add Item", icon: <FaSquarePlus /> },
    { path: "/admin/list", label: "List", icon: <FaListAlt /> },
    { path: "/admin/orders", label: "Orders", icon: <MdFactCheck /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/admin/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-[1440px] flex flex-col sm:flex-row">
      {/* SIDEBAR */}
      <div
        className={`bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dull)] backdrop-blur-md shadow-lg m-2 rounded-xl transition-all duration-300 
        ${collapsed ? "sm:w-[80px]" : "sm:w-[250px]"} sm:min-h-[97vh] flex flex-col justify-between`}
      >
        <div>
          {/* Profile & Collapse Button */}
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
              className={`p-1 rounded-full hover:bg-secondary/20 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              <BiChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="mt-4">
            {!collapsed && (
              <p className="px-5 text-xs text-gray-500 uppercase mb-2">Main</p>
            )}
            <nav className="flex flex-col gap-1">
              {navItems.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 relative group
                    ${
                      isActive
                        ? "bg-secondary text-white shadow-md border-l-4 border-tertiary"
                        : "hover:bg-secondary/10 text-gray-700"
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {link.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-5 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all w-full"
          >
            <BiLogOut className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
