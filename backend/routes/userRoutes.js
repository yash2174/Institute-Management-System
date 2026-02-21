import express from "express";
import { getProfile, updateProfile } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import profileUpload from '../middlewares/profileUpload.js';


const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, profileUpload.single("photo"), updateProfile);

export default router;
