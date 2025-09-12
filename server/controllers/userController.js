import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const cookieOptions = {
  httpOnly: true, // Prevent client-side javascript from accessing the cookie
  secure: (process.env.APP_ENV = "production"), //Ensure the cookies is only sent over HTTPS in production
  sameSite: (process.env.APP_ENV = "production" ? "none" : "strict"), // Controls when cookies are sent "none" allows cross-site in production, "strict" block cross-site by default
};

// USER REGISTER ROUTE

// src/controllers/userController.js

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1) Prevent duplicate
    if (await User.findOne({ email })) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // 2) Validate email & password
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Generate verification code & expiration
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // 5) Create user (unverified)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationExpires,
    });
    await newUser.save();

    // 6) Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bookstore" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `<p>Welcome to Bookstore, ${name}!<br/>Your verification code is <b>${verificationCode}</b>. It expires in 1 hour.</p>`,
    });

    // 7) Respond to client
    return res
      .status(201)
      .json({ success: true, message: "Verification code sent to email" });
  } catch (error) {
    console.error("userRegister error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password Please Try Again",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check Auth

export const isAuth = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// LOGOUT USER

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.json({ success: true, message: "Successfully Logged out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// GETTING USER FAVORITE BOOKS
export const getFavorites = async (req, res) => {
  try {
    console.log("🛠 getFavorites → incoming userId:", req.userId);
    const user = await User.findById(req.userId).populate("favorites");
    console.log("🛠 getFavorites → user.favorites from DB:", user?.favorites);
    return res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.error(err);
    console.error("getFavorites error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//TOGGLE ADD/REMOVE FAVORITE
// TOGGLE ADD/REMOVE FAVORITE
export const toggleFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log(
      "🛠 toggleFavorite → incoming userId:",
      req.userId,
      "bookId:",
      bookId
    );

    const user = await User.findById(req.userId);
    console.log(
      "🛠 toggleFavorite → before toggle user.favorites:",
      user.favorites
    );

    const idx = user.favorites.indexOf(bookId);
    if (idx === -1) {
      user.favorites.push(bookId);
    } else {
      user.favorites.splice(idx, 1);
    }

    await user.save();
    console.log(
      "🛠 toggleFavorite → after save user.favorites:",
      user.favorites
    );

    const updated = await User.findById(req.userId).populate("favorites");
    console.log("🛠 toggleFavorite → populated favorites:", updated.favorites);

    return res.json({ success: true, favorites: updated.favorites });
  } catch (err) {
    console.error("toggleFavorite error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//GET USER TICKETS
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//CREATE USER TICKET
export const createUserTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({
      user: req.userId,
      subject,
      message,
    });
    return res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE PROFILE (name & email)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    // Prevent using someone else’s email
    const exists = await User.findOne({ email, _id: { $ne: userId } });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const user = await User.findById(userId);
    user.name = name;
    user.email = email;
    await user.save();

    return res.json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(userId);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Optionally re-issue JWT cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { ...cookieOptions, maxAge: 7 * 24 * 3600_000 });

    return res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // Issue JWT now that user is verified
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESEND VERIFICATION CODE
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    // 1) Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2) Block if already verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    // 3) Generate new code + expiry
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    user.verificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // 4) Send email with the code
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bookstore" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your New Verification Code",
      html: `<p>Your new verification code is <b>${newCode}</b>. It expires in 1 hour.</p>`,
    });

    // 5) Respond
    return res.json({
      success: true,
      message: "A new verification code has been sent",
    });
  } catch (err) {
    console.error("resendCode error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
