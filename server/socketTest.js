import { io } from "socket.io-client";

const battleId = "PUT_YOUR_BATTLE_ID";

const userA = io("http://localhost:5000");
const userB = io("http://localhost:5000");

// ✅ ADD THIS
userA.on("connect", () => {
  console.log("User A connected:", userA.id);
});

userB.on("connect", () => {
  console.log("User B connected:", userB.id);
});

// join room
userA.emit("joinBattleRoom", battleId);
userB.emit("joinBattleRoom", battleId);

// listeners
userA.on("battleStarted", (data) => {
  console.log("A battleStarted:", data);
});

userB.on("battleStarted", (data) => {
  console.log("B battleStarted:", data);
});
