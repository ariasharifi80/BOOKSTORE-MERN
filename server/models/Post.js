import mongoose from "mongoose";
import slugify from "slugify";
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String }, // URL to Cloudinary
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
postSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
  if (this.isModified("status") && this.status === "published") {
    this.publishedAt = new Date();
  }
  next();
});
const Post = mongoose.models.post || mongoose.model("post", postSchema);

export default Post;
