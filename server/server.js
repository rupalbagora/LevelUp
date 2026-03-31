import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// 1️⃣ Create HTTP server
const server = http.createServer(app);

// 2️⃣ Attach Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 3️⃣ Handle connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join battle room
  socket.on("joinBattleRoom", (battleId) => {
    socket.join(battleId);
    console.log(`User joined room: ${battleId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 4️⃣ Export io (IMPORTANT)
export { io };

// 5️⃣ Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
