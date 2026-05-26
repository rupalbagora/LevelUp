import {
  getInitials,
  getAvatarColor,
  getRankInfo,
} from "../../../utils/battleHelpers";

export default function PlayerCard({ player }) {
  const initials = getInitials(player.username);
  const avatarColor = getAvatarColor(player.username);
  const rankInfo = getRankInfo(player.rank);

  const winRate =
    player.totalBattles > 0
      ? Math.round((player.totalWins / player.totalBattles) * 100)
      : 0;

  return (
    <div className="relative flex flex-col items-center gap-3 p-6 rounded-xl battle-surface w-60">
      <div
        className="absolute inset-0 blur-xl opacity-20 rounded-xl"
        style={{ background: avatarColor }}
      />

      <div className="relative flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${avatarColor}cc, ${avatarColor}44)`,
          }}
        >
          {initials}
        </div>

        <div className="text-sm font-bold text-slate-100">
          {player.username}
        </div>

        <span
          className="text-xs font-semibold"
          style={{ color: rankInfo.color }}
        >
          {rankInfo.icon} {player.rank}
        </span>
      </div>

      <div className="flex justify-between w-full text-xs text-slate-400">
        <div className="flex flex-col items-center">
          <span className="text-white font-bold">{player.totalWins}</span>
          Wins
        </div>

        <div className="flex flex-col items-center">
          <span className="text-white font-bold">{winRate}%</span>
          Win Rate
        </div>

        <div className="flex flex-col items-center">
          <span className="text-white font-bold">{player.totalBattles}</span>
          Battles
        </div>
      </div>

      <div className="w-full h-1 bg-slate-800 rounded">
        <div
          className="h-1 rounded"
          style={{
            width: `${winRate}%`,
            background: avatarColor,
          }}
        />
      </div>
    </div>
  );
}
