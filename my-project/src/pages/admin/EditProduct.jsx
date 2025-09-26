import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, fetchBooks } = useContext(ShopContext);

  const [form, setForm] = useState({
    name: "",
    author: "",
    summary: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
    popular: false,
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Reuse your singleProduct endpoint
        const { data } = await axios.post("/api/product/single", {
          productId: id,
        });
        if (data.success) {
          const p = data.product;
          setForm({
            name: p.name,
            author: p.author,
            summary: p.summary,
            description: p.description,
            category: p.category,
            price: p.price,
            offerPrice: p.offerPrice,
            popular: p.popular,
          });
        } else toast.error(data.message);
      } catch {
        toast.error("Could not load product");
      }
    })();
  }, [id, axios]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("author", form.author);
      formData.append("summary", form.summary);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("offerPrice", form.offerPrice);
      formData.append("popular", form.popular);
      images.forEach((file) => formData.append("images", file));

      const { data } = await axios.put(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Product updated");
        fetchBooks();
        navigate("/admin/list");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl mb-4">Edit Product</h2>

      {[
        { label: "Name", name: "name" },
        { label: "Author", name: "author" },
        { label: "Summary", name: "summary" },
        { label: "Description", name: "description", as: "textarea" },
        { label: "Category", name: "category" },
        { label: "Price", name: "price", type: "number" },
        { label: "Offer Price", name: "offerPrice", type: "number" },
      ].map(({ label, name, type, as }) => (
        <label key={name} className="block mb-3">
          {label}
          {as === "textarea" ? (
            <textarea
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          ) : (
            <input
              name={name}
              type={type || "text"}
              value={form[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
        </label>
      ))}

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          name="popular"
          checked={form.popular}
          onChange={handleChange}
          className="mr-2"
        />
        Mark as popular
      </label>

      <label className="block mb-4">
        Upload New Images
        <input
          type="file"
          multiple
          onChange={handleFiles}
          className="w-full mt-1"
        />
      </label>

      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded"
      >
        Save Changes
      </button>
    </form>
  );
}
