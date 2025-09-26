import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

//CONTROLLER FUNCTION FOR ADDING PRODUCT

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      author,
      description,
      summary,
      category,
      price,
      offerPrice,
      popular,
    } = JSON.parse(req.body.productData);

    const images = req.files || [];

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({
      name,
      author,
      description,
      summary,
      category,
      price,
      offerPrice,
      popular,
      image: imagesUrl,
    });

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//CONTROLLER FUNCTION FOR PRODUCT LIST
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// CONTROLLER FUNCTION FOR GETTING A PRODUCT DETAILS

export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// CONTROLLER FUNCTION FOR CHANGING THE PRODUCT STOCK

export const changeStock = async (req, res) => {
  try {
    const { productId, inStock } = req.body;
    await Product.findByIdAndUpdate(productId, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// CONTROLLER FUNCTION FOR DELETING THE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);
    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("deleteProduct error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//CONTROLLER FUNCTION FOR EDITING A PRODUCT

// UPDATE A PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Parse JSON data if you sent multipart/form-data
    let updates = { ...req.body };

    // 2) Handle new images (optional)
    if (req.files && req.files.length) {
      const imagesUrl = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      updates.image = imagesUrl;
    }

    // 3) Apply the update
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
