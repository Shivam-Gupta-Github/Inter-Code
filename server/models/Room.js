import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  passkey: { type: String, required: true },
  code: { type: String, default: "" },
});

export default mongoose.model("Room", roomSchema);
