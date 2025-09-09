/* src/pages/AdminUsers.jsx */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";

const AdminUsers = () => {
  const {
    adminUsers,
    adminTickets,
    adminLoading,
    fetchAdminUsers,
    adminDeleteUser,
    fetchAdminTickets,
    adminToggleTicketStatus,
    adminDeleteTicket,
    adminExportTickets,
  } = useContext(ShopContext);

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Filtered & paginated users
  const filtered = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageUsers = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleExpand = (userId) => {
    setExpanded(expanded === userId ? null : userId);
    if (!adminTickets[userId]) fetchAdminTickets(userId);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User & Ticket Management</h2>

      {/* Search */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="p-2 border rounded flex-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Users Table */}
      {adminLoading ? (
        <p>Loading users…</p>
      ) : (
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Joined</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageUsers.map((u) => (
              <React.Fragment key={u._id}>
                <tr className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleExpand(u._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      {expanded === u._id ? "Hide Tickets" : "View Tickets"}
                    </button>
                    <button
                      onClick={() => adminDeleteUser(u._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {expanded === u._id && (
                  <tr>
                    <td colSpan={4} className="bg-gray-50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Tickets</h3>
                        <button
                          onClick={() => adminExportTickets(u._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded small"
                        >
                          Export CSV
                        </button>
                      </div>

                      {!adminTickets[u._id]?.length ? (
                        <p className="text-sm text-gray-500">
                          No tickets found.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {adminTickets[u._id].map((t) => (
                            <li
                              key={t._id}
                              className="flex justify-between items-start bg-white p-3 rounded shadow"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{t.subject}</p>
                                <p className="text-sm text-gray-600">
                                  {t.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {t.status}
                                  </span>{" "}
                                  • {new Date(t.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <button
                                  onClick={() =>
                                    adminToggleTicketStatus(
                                      u._id,
                                      t._id,
                                      t.status === "open" ? "closed" : "open",
                                    )
                                  }
                                  className="px-2 py-1 bg-yellow-400 text-white rounded text-sm"
                                >
                                  {t.status === "open" ? "Close" : "Reopen"}
                                </button>
                                <button
                                  onClick={() =>
                                    adminDeleteTicket(u._id, t._id)
                                  }
                                  className="px-2 py-1 bg-red-400 text-white rounded text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
