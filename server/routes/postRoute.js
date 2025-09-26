import express from "express";
import { upload } from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  listPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/", listPosts);
postRouter.get("/:slug", getPostBySlug);

// Admin‐only
postRouter.post("/", authAdmin, upload.single("coverImage"), createPost);
postRouter.put("/:id", authAdmin, upload.single("coverImage"), updatePost);
postRouter.delete("/:id", authAdmin, deletePost);

export default postRouter;
