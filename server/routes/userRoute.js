import express from "express";
import {
  isAuth,
  logout,
  userLogin,
  userRegister,
  getFavorites,
  toggleFavorite,
  getUserTickets,
  createUserTicket,
  updateProfile,
  changePassword,
  verifyEmail,
  resendCode,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

//LOGIN-LOGOUT-REGISTER
userRouter.post("/register", userRegister);
//VERIFY THE USER
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-code", resendCode);

userRouter.post("/login", userLogin);
userRouter.post("/logout", logout);

//PROFILE & PASSWORD
userRouter.put("/update", authUser, updateProfile);
userRouter.put("/change-password", authUser, changePassword);

//FAVORITES BOOKS
userRouter.get("/favorites", authUser, getFavorites);
userRouter.post("/favorites/:bookId", authUser, toggleFavorite);

// TICKET ROUTES
userRouter.get("/tickets", authUser, getUserTickets);
userRouter.post("/ticket", authUser, createUserTicket);

userRouter.get("/is-auth", authUser, isAuth);

export default userRouter;
