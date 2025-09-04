import express from "express";
import authUser from "../middlewares/authUser.js";
import { addToCart, updateCart } from "../controllers/cartController.js";

const CartRouter = express.Router();

CartRouter.post("/add", authUser, addToCart);
CartRouter.post("/update", authUser, updateCart);

export default CartRouter;
