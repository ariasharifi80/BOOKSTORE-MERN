import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

const cookieOptions = {
  httpOnly: true, // Prevent client-side javascript from accessing the cookie
  secure: (process.env.APP_ENV = "production"), //Ensure the cookies is only sent over HTTPS in production
  sameSite: (process.env.APP_ENV = "production" ? "none" : "strict"), // Controls when cookies are sent "none" allows cross-site in production, "strict" block cross-site by default
};

// USER REGISTER ROUTE

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Checking if user is already exist or not
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exist" });
    }
    // Validate password and checking strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a Valid Email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }
    //Hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
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

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
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
    const user = await User.findById(req.userId).populate("favorites");
    return res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//TOGGLE ADD/REMOVE FAVORITE
export const toggleFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.userId);
    const idx = user.favorites.indexOf(bookId);

    if (idx === -1) {
      user.favorites.push(bookId);
    } else {
      user.favorites.splice(idx, 1);
    }

    await user.save();
    const updated = await User.findById(req.userId).populate("favorites");
    return res.json({ success: true, favorites: updated.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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
