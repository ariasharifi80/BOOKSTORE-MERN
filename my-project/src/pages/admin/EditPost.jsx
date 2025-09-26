// src/pages/admin/EditPost.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

export default function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fetchPostBySlug, updatePost } = useContext(ShopContext);

  const [postId, setPostId] = useState("");
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      const post = await fetchPostBySlug(slug);
      if (post) {
        setPostId(post._id);
        setForm({
          title: post.title,
          author: post.author,
          excerpt: post.excerpt,
          content: post.content,
          categories: post.categories.join(", "),
          tags: post.tags.join(", "),
          status: post.status,
        });
      }
      setLoading(false);
    };
    loadPost();
  }, [slug, fetchPostBySlug]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    if (e.target.files.length) {
      setCoverImage(e.target.files[0]);
    }
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
      await updatePost({ id: postId, postData, coverImageFile: coverImage });
      navigate("/admin/posts");
    } catch {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading post…</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Edit Blog Post</h2>

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

      <label className="block mb-6">
        <span className="block text-sm font-medium">Cover Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="mt-1"
        />
      </label>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2 font-medium rounded ${
            submitting
              ? "bg-gray-400 cursor-not-allowed text-gray-700"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {submitting ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/posts")}
          className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
