// src/pages/admin/PostList.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

export default function PostList() {
  const { fetchPosts, deletePost } = useContext(ShopContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts({ page: 1, limit: 100, status: "" });
      if (data.success) {
        setPosts(data.posts);
      }
    };
    loadPosts();
  }, [fetchPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // error toast already shown in deletePost
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Blog Posts</h2>
        <button
          onClick={() => navigate("/admin/posts/new")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post._id}
              className="flex justify-between items-center p-4 border rounded"
            >
              <div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  {post.publishedAt && (
                    <> • {new Date(post.publishedAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/admin/posts/${post.slug}/edit`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
