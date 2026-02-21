import express from "express";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourse);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("file"),
  createCourse
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("file"),
  updateCourse
);

router.delete("/:id", authenticate, authorize("admin"), deleteCourse);

export default router;
