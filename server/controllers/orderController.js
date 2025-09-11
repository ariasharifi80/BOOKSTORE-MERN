import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

//Global vars for payment

const currency = "usd";
const deliveryCharges = 10;
const taxPercentage = 0.02;

// PLACE ORDER USING COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (items.length === 0) {
      return res.json({ success: false, message: "Please add product first" });
    }

    // calculate  amount using items

    let subtotal = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);

      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // calculate total amount
    const taxAmount = subtotal * taxPercentage;
    const totalAmount = subtotal + taxAmount + deliveryCharges;

    await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentMethod: "COD",
    });

    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartData: {} });
    return res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: true, message: error.message });
  }
};

//

// ALL ORDERS DATA FOR FRONTEND BY USERID
export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({
      userId,
      $or: [{ paymentMethod: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: true, message: error.message });
  }
};

// ALL ORDERS DATA FOR ADMIN PANEL
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentMethod: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: true, message: error.message });
  }
};

// UPDATING ORDER STATUS FROM ADMIN PANEL
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: true, message: error.message });
  }
};

//DELETE ORDER FOR ADMIN
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    return res.json({ success: true, message: "Order Deleted" });
  } catch (error) {
    console.error("deleteOrder error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
