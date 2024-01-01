import { Router } from "express";
import { RegisterUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// register Route
router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);

//restricted routes
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
