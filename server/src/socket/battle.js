import Battle from "../models/Battle.js";
import User from "../models/User.js";

export default function registerBattleHandlers(io, socket) {
  socket.on("joinBattleRoom", async (battleId) => {
    try {
      socket.join(battleId);
      console.log(`User joined room: ${battleId}`);

      const room = io.sockets.adapter.rooms.get(battleId);
      const count = room?.size || 0;

      console.log("Players in room:", count);

      // 🔥 Start only when both players joined
      if (count === 2) {
        console.log("🔥 Both players connected → starting battle");

        const battle = await Battle.findById(battleId);

        if (!battle || battle.status !== "ongoing") return;

        // ✅ Fetch users
        const creator = await User.findById(battle.creatorId);
        const opponent = await User.findById(battle.opponentId);

        // ✅ Format function
        function formatUser(user) {
          const winRate =
            user.totalBattles > 0
              ? Math.round((user.totalWins / user.totalBattles) * 100)
              : 0;

          return {
            id: user._id,
            username: user.username,
            rank: user.rank,
            totalWins: user.totalWins,
            totalBattles: user.totalBattles,
            winRate,
          };
        }

        // ✅ Emit FULL DATA
        io.to(battleId).emit("battleStarted", {
          battleId,
          players: {
            creator: formatUser(creator),
            opponent: formatUser(opponent),
          },
          startTime: battle.startTime,
          endTime: battle.endTime,
          questionId: battle.questionId,
        });

        io.to(battleId).emit("timerSync", {
          startTime: battle.startTime,
          endTime: battle.endTime,
        });
      }
    } catch (err) {
      console.error("joinBattleRoom error:", err);
    }
  });
}
