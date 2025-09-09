// controllers/adminController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.APP_ENV === "production",
  sameSite: process.env.APP_ENV === "production" ? "none" : "strict",
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("adminToken", token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: "Admin logged in" });
    }
    return res.json({ success: false, message: "Invalid Credentials" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check admin auth (middleware hit-test)
export const isAdminAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", cookieOptions);
    return res.json({ success: true, message: "Admin Logged Out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── User & Ticket Management ────────────────────────────────────────── */

// GET /api/admin/users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email createdAt")
      .sort("-createdAt");
    return res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/users/:userId
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    // remove all tickets by that user
    await Ticket.deleteMany({ user: userId });
    return res.json({
      success: true,
      message: "User and their tickets removed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users/:userId/tickets
export const listUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await Ticket.find({ user: userId }).sort("-createdAt");
    return res.json({ success: true, tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/tickets/:ticketId
// body: { status: "open"|"closed" }
export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    if (!["open", "closed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }
    await Ticket.findByIdAndUpdate(ticketId, { status });
    return res.json({ success: true, message: "Ticket status updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/tickets/:ticketId
export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    await Ticket.findByIdAndDelete(ticketId);
    return res.json({ success: true, message: "Ticket deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
