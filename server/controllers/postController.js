// src/controllers/postController.js
import Post from "../models/Post.js";
import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// —– configure Cloudinary via env vars —–
cloudinary.config({
  cloud_name: process.env.CLDN_NAME,
  api_key: process.env.CLDN_API_KEY,
  api_secret: process.env.CLDN_API_SECRET,
});

// 1) List posts (with optional pagination & published filter)
export const listPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "published" } = req.query;
    const filter = status ? { status } : {};
    const posts = await Post.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const count = await Post.countDocuments(filter);
    res.json({ success: true, posts, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2) Get single post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3) Create a new post (admin only)
export const createPost = async (req, res) => {
  console.log("🔍 createPost – req.file:", req.file);
  console.log("🔍 createPost – req.body.postData:", req.body.postData);

  try {
    const data = JSON.parse(req.body.postData);
    data.slug = slugify(data.title, { lower: true, strict: true });

    // ←─ Replace your old upload logic with this block ──→
    if (req.file) {
      const localPath = req.file.path;
      console.log("Uploading local file at:", localPath);

      const uploadResult = await cloudinary.uploader.upload(localPath, {
        folder: "blog_posts",
      });
      data.coverImage = uploadResult.secure_url;

      // remove the file from disk after upload
      fs.unlinkSync(localPath);
    }
    // ←─────────────────────────────────────────────────→

    const post = await Post.create(data);
    return res.json({ success: true, post });
  } catch (err) {
    console.error("❌ createPost error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4) Update a post (admin only)
export const updatePost = async (req, res) => {
  console.log("🔍 updatePost – req.file:", req.file);
  console.log("🔍 updatePost – req.body.postData:", req.body.postData);

  try {
    const { id } = req.params;
    const updates = JSON.parse(req.body.postData);
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    // ←─ Replace your old upload logic with this block ──→
    if (req.file) {
      const localPath = req.file.path;
      console.log("Uploading updated file at:", localPath);

      const uploadResult = await cloudinary.uploader.upload(localPath, {
        folder: "blog_posts",
      });
      updates.coverImage = uploadResult.secure_url;
      fs.unlinkSync(localPath);

      // optional: remove old image from Cloudinary…
    }
    // ←─────────────────────────────────────────────────→

    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    return res.json({ success: true, post });
  } catch (err) {
    console.error("❌ updatePost error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5) Delete a post (admin only)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Post.findByIdAndDelete(id);

    // remove image from Cloudinary
    if (existing?.coverImage) {
      const publicId = existing.coverImage
        .split("/")
        .slice(-1)[0]
        .split(".")[0];
      await cloudinary.uploader.destroy(`blog_posts/${publicId}`);
    }

    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
