import express from "express";
import getVid from "../controllers/videoController.js";
import videoController from "../controllers/videoController.js";

const router = express.Router();

// Route GET /
router.get("/", videoController.getVid);
router.get("/:_id", videoController.getVideoById);

export default router;
