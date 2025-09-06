import React, { useContext, useState } from "react";
import upload_icon from "../../assets/upload_icon.png";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(ShopContext);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("10");
  const [offerPrice, setOfferPrice] = useState("10");
  const [category, setCategory] = useState("Academic");
  const [popular, setPopular] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const productData = {
        name,
        description,
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
        setDescription("");
        setFiles([]);
        setPrice("10");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll w-full lg:w-4/5 rounded-xl">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-y-3 medium-14"
      >
        <div className="w-full">
          <h5 className="h5">Product Name</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Write here... "
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-xl"
          />
        </div>
        <div className="w-full">
          <h5 className="h5">Product Description</h5>
          <textarea
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            type="text"
            placeholder="Write here... "
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-xl"
          />
        </div>
        <div>
          <div className="flex gap-4">
            <div>
              <h5 className="h5">Product Category</h5>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className=" mx-w-30 px-3 py-2  ring-1 ring-slate-900/10 rounded bg-white mt-1  "
              >
                <option value="Academic">Academic</option>
                <option value="Children">Children</option>
                <option value="Health">Health</option>
                <option value="Horror">Horror</option>
                <option value="Business">Business</option>
                <option value="History">History</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>
            <div>
              <h5 className="h5">Product Price</h5>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                placeholder="10"
                className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1  max-w-24"
              />
            </div>
            <div>
              <h5 className="h5">Offer Price</h5>
              <input
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                type="number"
                placeholder="10"
                className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1  max-w-24"
              />
            </div>
          </div>
        </div>
        {/* IMAGES */}
        <div className="flex gap-3 mt-2">
          {Array(4)
            .fill("")
            .map((_, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="ring-1 ring-slate-900/10 overflow-hidden rounded"
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
                  alt="uploadArea"
                  width={67}
                  height={67}
                  className="bg-white overflow-hidden aspect-square object-cover"
                />
              </label>
            ))}
        </div>
        <div className="flexStart gap-2 my-2">
          <input
            onChange={() => setPopular((prev) => !prev)}
            checked={popular}
            type="checkbox"
            id="popular"
          />
          <label htmlFor="popular" className="cursor-pointer">
            Add to Popular
          </label>
        </div>
        <button
          type="submit"
          className="btn-dark mt-3 max-w-44 sm:w-full rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
