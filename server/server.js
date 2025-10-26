import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import roomRoutes from "./routes/roomRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

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

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
}

io.on("connection", (socket) => {
  // console.log("Socket connected: ", socket.id);

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients: clients,
        username: username,
        socketId: socket.id,
      });
    });
  });

  socket.on("code-change", ({ roomId, changes }) => {
    socket.in(roomId).emit("code-change", { changes });
  });

  socket.on("sync-code", ({ code, socketId }) => {
    io.to(socketId).emit("code-change", { code });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
