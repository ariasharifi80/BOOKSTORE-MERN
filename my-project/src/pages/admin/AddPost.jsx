// src/pages/admin/AddPost.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

export default function AddPost() {
  const { createPost } = useContext(ShopContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: "",
    categories: "",
    tags: "",
    status: "draft",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    if (e.target.files.length) setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const postData = {
      ...form,
      categories: form.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      await createPost({ postData, coverImageFile: coverImage });
      navigate("/admin/posts");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">New Blog Post</h2>

      {/* Title, Author, Excerpt, Categories, Tags */}
      {[
        { label: "Title", name: "title", type: "text" },
        { label: "Author", name: "author", type: "text" },
        { label: "Excerpt", name: "excerpt", type: "text" },
        {
          label: "Categories (comma-separated)",
          name: "categories",
          type: "text",
        },
        { label: "Tags (comma-separated)", name: "tags", type: "text" },
      ].map(({ label, name, type }) => (
        <label key={name} className="block mb-4">
          <span className="block text-sm font-medium">{label}</span>
          <input
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded"
          />
        </label>
      ))}

      {/* Status */}
      <label className="block mb-4">
        <span className="block text-sm font-medium">Status</span>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      {/* Content */}
      <label className="block mb-4">
        <span className="block text-sm font-medium">Content</span>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={8}
          required
          className="mt-1 w-full p-2 border rounded resize-vertical"
        />
      </label>

      {/* Cover Image */}
      <label className="block mb-6">
        <span className="block text-sm font-medium">Cover Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="mt-1"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className={`px-6 py-2 font-medium rounded ${
          submitting
            ? "bg-gray-400 cursor-not-allowed text-gray-700"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {submitting ? "Creating…" : "Create Post"}
      </button>
    </form>
  );
}
