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
  try {
    // parse once
    const data = JSON.parse(req.body.postData);

    // slugify title server-side
    data.slug = slugify(data.title, { lower: true, strict: true });

    // upload coverImage if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
      });
      data.coverImage = upload.secure_url;
      // remove local temp file
      fs.unlinkSync(req.file.path);
    }

    // leave publishedAt to your model’s pre-save hook
    const post = await Post.create(data);
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4) Update a post (admin only)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = JSON.parse(req.body.postData);

    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    // handle new coverImage
    if (req.file) {
      // upload new
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
      });
      updates.coverImage = upload.secure_url;
      fs.unlinkSync(req.file.path);

      // remove old image from Cloudinary
      const existing = await Post.findById(id);
      if (existing?.coverImage) {
        const publicId = existing.coverImage
          .split("/")
          .slice(-1)[0]
          .split(".")[0]; // crude but works if you know your folder
        await cloudinary.uploader.destroy(`blog_posts/${publicId}`);
      }
    }

    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
