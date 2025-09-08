import React, { useContext, useState } from "react";
import upload_icon from "../../assets/upload_icon.png";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(ShopContext);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState(""); // NEW
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState(""); // NEW
  const [price, setPrice] = useState("10");
  const [offerPrice, setOfferPrice] = useState("10");
  const [category, setCategory] = useState("Academic");
  const [popular, setPopular] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const productData = {
        name,
        author, // NEW
        description,
        summary, // NEW
        category,
        price,
        offerPrice,
        popular,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/product/add", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setAuthor(""); // NEW
        setDescription("");
        setSummary(""); // NEW
        setFiles([]);
        setPrice("10");
        setOfferPrice("10");
        setPopular(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="px-4 sm:px-8 py-10 m-2 
      bg-gradient-to-br from-blue-50 via-white to-teal-50 
      rounded-xl w-full lg:w-4/5"
    >
      {/* Floating Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
          {/* Section: Basic Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Basic Info
            </h4>
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Product Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter product name"
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Author
                </label>
                <input
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                  type="text"
                  placeholder="Enter author name"
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Write a detailed description..."
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Summary
                </label>
                <textarea
                  rows={3}
                  onChange={(e) => setSummary(e.target.value)}
                  value={summary}
                  placeholder="Write a short summary..."
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Pricing
            </h4>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Category
                </label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="mt-1 p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                >
                  <option>Academic</option>
                  <option>Children</option>
                  <option>Health</option>
                  <option>Horror</option>
                  <option>Business</option>
                  <option>History</option>
                  <option>Adventure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Price
                </label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  type="number"
                  className="mt-1 w-24 p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Offer Price
                </label>
                <input
                  onChange={(e) => setOfferPrice(e.target.value)}
                  value={offerPrice}
                  type="number"
                  className="mt-1 w-24 p-2.5 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Section: Images */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Images</h4>
            <div className="flex gap-3 flex-wrap">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg 
                    flex items-center justify-center cursor-pointer hover:border-blue-300 transition"
                  >
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    <img
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index])
                          : upload_icon
                      }
                      alt="upload"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </label>
                ))}
            </div>
          </div>

          {/* Section: Options */}
          <div className="flex items-center gap-2">
            <input
              onChange={() => setPopular((prev) => !prev)}
              checked={popular}
              type="checkbox"
              id="popular"
              className="w-4 h-4"
            />
            <label
              htmlFor="popular"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Add to Popular
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setAuthor(""); // NEW
                setDescription("");
                setSummary(""); // NEW
                setFiles([]);
                setPrice("10");
                setOfferPrice("10");
                setPopular(false);
              }}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
