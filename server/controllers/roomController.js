import bcrypt from "bcryptjs";
import Room from "../models/Room.js";

// Create new room
export const createRoom = async (req, res) => {
  try {
    const { roomId, passkey } = req.body;

    if (!roomId || !passkey)
      return res
        .status(400)
        .json({ message: "Room ID and passkey are required." });

    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom)
      return res
        .status(409)
        .json({ message: "Room ID already exists. Please use a new one." });

    const hashedPasskey = await bcrypt.hash(passkey, 10);
    await Room.create({ roomId, passkey: hashedPasskey });

    return res.status(201).json({ message: "Room created successfully!" });
  } catch (error) {
    console.error("Error creating room:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating room." });
  }
};

// Verify room access
export const verifyRoom = async (req, res) => {
  try {
    const { roomId, passkey } = req.body;

    if (!roomId || !passkey)
      return res
        .status(400)
        .json({ message: "Room ID and passkey are required." });

    const room = await Room.findOne({ roomId });
    if (!room)
      return res
        .status(404)
        .json({ message: "Room not found. Please check the Room ID." });

    const isMatch = await bcrypt.compare(passkey, room.passkey);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Invalid passkey. Access denied." });

    return res.status(200).json({ message: "Access granted." });
  } catch (error) {
    console.error("Error verifying room:", error);
    return res
      .status(500)
      .json({ message: "Server error while verifying room." });
  }
};
