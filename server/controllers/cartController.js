import User from "../models/User.js";

// ADDING TO THE CART
export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;
    const userData = await User.findById(userId);
    const cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// UPDATE THE CART
export const updateCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.userId;

    const userData = await User.findById(userId);
    const cartData = userData.cartData;

    await User.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
