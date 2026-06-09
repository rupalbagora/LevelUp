import "./src/config/env.js";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import registerBattleHandlers from "./src/socket/battle.js";
import { setLeaderboardSocket } from "./src/services/leaderboardServices.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  },
});

setLeaderboardSocket(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 👉 delegate logic
  registerBattleHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other server or change PORT in .env`,
    );
    process.exit(1);
  }
  console.error("Server error:", error.message);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
