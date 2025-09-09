// routes/adminRoute.js
import express from "express";
import {
  adminLogin,
  adminLogout,
  isAdminAuth,
  listUsers,
  deleteUser,
  listUserTickets,
  updateTicketStatus,
  deleteTicket,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Public endpoints
adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);

// Auth test
adminRouter.get("/is-auth", authAdmin, isAdminAuth);

// Protected user management
adminRouter.get("/users", authAdmin, listUsers);
adminRouter.delete("/users/:userId", authAdmin, deleteUser);
adminRouter.get("/users/:userId/tickets", authAdmin, listUserTickets);

// Protected ticket management
adminRouter.patch("/tickets/:ticketId", authAdmin, updateTicketStatus);
adminRouter.delete("/tickets/:ticketId", authAdmin, deleteTicket);

export default adminRouter;
