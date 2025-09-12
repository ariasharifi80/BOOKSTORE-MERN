import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpires: { type: Date },
  },
  { minimize: false }
);

const User = mongoose.model.user || mongoose.model("user", userSchema);

export default User;
