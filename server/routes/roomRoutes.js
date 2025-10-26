import express from "express";
const router = express.Router();
import { createRoom, verifyRoom } from "../controllers/roomController.js";

router.post("/", createRoom); // POST /api/rooms
router.post("/verify", verifyRoom); // POST /api/rooms/verify

export default router;
