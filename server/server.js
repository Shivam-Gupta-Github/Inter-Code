import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import roomRoutes from "./routes/roomRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import Room from "./models/Room.js";

// Connect to MongoDB
connectDB();

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running!");
});

// Routes
app.use("/api/rooms", roomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://intercode.shivamdev.me"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

// In-memory code storage for each room
const roomCodeMap = {};

// Default C++ template
const DEFAULT_CPP_CODE = `#include <bits/stdc++.h>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`;

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
}

const DEBOUNCE_DELAY = 5000;
const saveTimeouts = {};

io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.on("join", async ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    // Load from DB if roomCodeMap empty
    if (!roomCodeMap[roomId]) {
      const room = await Room.findOne({ roomId });
      if (room) {
        roomCodeMap[roomId] = room.code;
      } else {
        roomCodeMap[roomId] = DEFAULT_CPP_CODE;
      }
    }

    const clients = getAllConnectedClients(roomId);

    // Notify all clients about the new user
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients: clients,
        username: username,
        socketId: socket.id,
      });
    });

    // Send current room code to the new user
    socket.emit("code-update", { code: roomCodeMap[roomId] });
  });

  // Handle request for current code (when user joins)
  socket.on("request-code", ({ roomId }) => {
    if (roomCodeMap[roomId]) {
      socket.emit("code-update", { code: roomCodeMap[roomId] });
    }
  });

  // Handle code changes
  socket.on("code-change", ({ roomId, changes, code }) => {
    // Update the room's code in memory
    roomCodeMap[roomId] = code;

    // Broadcast the code change to all other users in the room
    socket.to(roomId).emit("code-update", { changes });

    // Debounce DB save
    if (saveTimeouts[roomId]) clearTimeout(saveTimeouts[roomId]);
    saveTimeouts[roomId] = setTimeout(async () => {
      try {
        await Room.findOneAndUpdate({ roomId }, { code }, { upsert: false });
        console.log(`Code for room ${roomId} saved to DB`);
      } catch (err) {
        console.error(`Failed to save code for room ${roomId}:`, err);
      }
    }, DEBOUNCE_DELAY);
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });

      // Clean up room code if no one is left in the room
      const remainingClients = getAllConnectedClients(roomId).filter(
        (client) => client.socketId !== socket.id
      );

      if (remainingClients.length === 0) {
        console.log(`Room ${roomId} is empty, cleaning up code`);
        delete roomCodeMap[roomId];
      }
    });
    delete userSocketMap[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
