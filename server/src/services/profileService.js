import Battle from "../models/Battle.js";
import Leaderboard from "../models/leaderboard.js";
import User from "../models/User.js";

const formatRelativeTime = (date) => {
  if (!date) return "";
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
};

const formatJoinedDate = (createdAt) => {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export const calculateWinStreak = async (userId) => {
  const battles = await Battle.find({
    status: "completed",
    $or: [{ creatorId: userId }, { opponentId: userId }],
  })
    .sort({ completedAt: -1, updatedAt: -1 })
    .limit(100)
    .lean();

  let streak = 0;
  for (const battle of battles) {
    if (battle.winnerId && battle.winnerId.toString() === userId.toString()) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
};

const getOpponentUsername = async (battle, userId) => {
  const opponentId =
    battle.creatorId?.toString() === userId.toString()
      ? battle.opponentId
      : battle.creatorId;
  if (!opponentId) return "Unknown";
  const opponent = await User.findById(opponentId).select("username").lean();
  return opponent?.username || "Unknown";
};

const buildBadges = (user, streak, globalRank) => {
  const unlocked = [];
  const locked = [];

  const badgeDefs = [
    {
      name: "First Victory",
      emoji: "🏆",
      check: () => (user.totalWins || 0) >= 1,
    },
    {
      name: "Speed Demon",
      emoji: "⚡",
      check: () => (user.totalBattles || 0) >= 5,
    },
    {
      name: "5 Win Streak",
      emoji: "🔥",
      check: () => streak >= 5,
    },
    {
      name: "Binary Master",
      emoji: "🎯",
      check: () => (user.totalBattles || 0) >= 10,
    },
    {
      name: "Top 500",
      emoji: "👑",
      check: () => globalRank !== null && globalRank <= 500,
    },
    {
      name: "DP Wizard",
      emoji: "🧙‍♂️",
      check: () => (user.totalWins || 0) >= 25,
    },
    {
      name: "100 Wins",
      emoji: "💯",
      check: () => (user.totalWins || 0) >= 100,
    },
    {
      name: "Perfect Week",
      emoji: "✨",
      check: () => streak >= 7,
    },
  ];

  badgeDefs.forEach((badge) => {
    const item = {
      name: badge.name,
      emoji: badge.emoji,
      locked: !badge.check(),
      date: badge.check()
        ? new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Locked",
    };
    if (item.locked) locked.push(item);
    else unlocked.push(item);
  });

  return [...unlocked, ...locked];
};

const buildTopicMastery = (battles, userId) => {
  const topicMap = {};
  battles.forEach((battle) => {
    if (!battle.topic) return;
    if (!topicMap[battle.topic]) {
      topicMap[battle.topic] = { completed: 0, wins: 0 };
    }
    topicMap[battle.topic].completed += 1;
    if (battle.winnerId?.toString() === userId.toString()) {
      topicMap[battle.topic].wins += 1;
    }
  });

  return Object.entries(topicMap)
    .map(([topic, data]) => ({
      topic,
      completed: data.completed,
      progress: data.completed
        ? Math.min(Math.round((data.wins / data.completed) * 100), 100)
        : 0,
    }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 8);
};

const buildPerformanceInsights = (battles, userId, streak) => {
  const wins = battles.filter(
    (b) => b.winnerId?.toString() === userId.toString(),
  );

  const topicWins = {};
  wins.forEach((b) => {
    if (b.topic) topicWins[b.topic] = (topicWins[b.topic] || 0) + 1;
  });
  const topTopic = Object.entries(topicWins).sort((a, b) => b[1] - a[1])[0];

  let fastestLabel = "—";
  if (wins.length > 0) {
    const fastest = wins.reduce((best, b) => {
      if (!b.startTime || !b.completedAt) return best;
      const duration =
        new Date(b.completedAt).getTime() - new Date(b.startTime).getTime();
      return duration < best.duration ? { battle: b, duration } : best;
    }, { duration: Infinity, battle: null });
    if (fastest.battle) {
      const secs = Math.floor(fastest.duration / 1000);
      const mins = Math.floor(secs / 60);
      const rem = secs % 60;
      fastestLabel = mins > 0 ? `${mins}m ${rem}s` : `${rem}s`;
    }
  }

  return [
    {
      title: "Best Streak",
      value: `${streak} Win${streak !== 1 ? "s" : ""}`,
      date: streak > 0 ? "Current run" : "No streak yet",
      color: "green",
    },
    {
      title: "Fastest Win",
      value: fastestLabel,
      date: wins[0]?.topic
        ? `${wins[0].topic} - ${wins[0].difficulty || "Battle"}`
        : "Complete a battle",
      color: "blue",
    },
    {
      title: "Most Wins Topic",
      value: topTopic ? topTopic[0] : "—",
      date: topTopic ? `${topTopic[1]} Win${topTopic[1] !== 1 ? "s" : ""}` : "—",
      color: "orange",
    },
  ];
};

export const buildUserProfilePayload = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) return null;

  const leaderboardEntry = await Leaderboard.findOne({ userId });
  const globalRank = leaderboardEntry?.rankPosition ?? null;

  const streak = await calculateWinStreak(userId);
  const winRate =
    user.totalBattles > 0
      ? Math.round((user.totalWins / user.totalBattles) * 100)
      : 0;

  const completedBattles = await Battle.find({
    status: "completed",
    $or: [{ creatorId: userId }, { opponentId: userId }],
  })
    .sort({ completedAt: -1, updatedAt: -1 })
    .limit(30)
    .populate("creatorId", "username")
    .populate("opponentId", "username")
    .lean();

  const recentActivity = await Promise.all(
    completedBattles.slice(0, 10).map(async (battle) => {
      const isWin = battle.winnerId?.toString() === userId.toString();
      const opponent = await getOpponentUsername(battle, userId);
      return {
        type: isWin ? "Victory" : "Defeat",
        vs: opponent,
        topic: battle.topic || "General",
        time: formatRelativeTime(battle.completedAt || battle.updatedAt),
      };
    }),
  );

  const statsSummary = [
    {
      label: "Global Rank",
      value: globalRank ? `#${globalRank}` : "Unranked",
    },
    {
      label: "Total Battles",
      value: String(user.totalBattles || 0),
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
    },
    {
      label: "Current Streak",
      value: String(streak),
    },
  ];

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      language: user.language || [],
      github: user.github || "",
      linkedin: user.linkedin || "",
      avatar: user.avatar || "🦁",
      totalWins: user.totalWins || 0,
      totalBattles: user.totalBattles || 0,
      rank: user.rank,
      joinedAt: formatJoinedDate(user.createdAt),
      createdAt: user.createdAt,
    },
    statsSummary,
    globalRank,
    winRate,
    currentStreak: streak,
    badges: buildBadges(user, streak, globalRank),
    activity: recentActivity,
    topicMastery: buildTopicMastery(completedBattles, userId),
    performanceInsights: buildPerformanceInsights(
      completedBattles,
      userId,
      streak,
    ),
    battleHistory: await Promise.all(
      completedBattles.slice(0, 5).map(async (battle) => {
        const isWin = battle.winnerId?.toString() === userId.toString();
        const opponent = await getOpponentUsername(battle, userId);
        let timeLabel = "—";
        if (battle.startTime && battle.completedAt) {
          const secs = Math.floor(
            (new Date(battle.completedAt) - new Date(battle.startTime)) / 1000,
          );
          const mins = Math.floor(secs / 60);
          timeLabel = mins > 0 ? `${mins}m ${secs % 60}s` : `${secs}s`;
        }
        return {
          opponent,
          result: isWin ? "Won" : "Lost",
          time: timeLabel,
          difficulty: `${battle.topic || "General"} · ${battle.difficulty || "—"}`,
        };
      }),
    ),
  };
};

export const formatPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  bio: user.bio || "",
  language: user.language || [],
  github: user.github || "",
  linkedin: user.linkedin || "",
  avatar: user.avatar || "🦁",
  totalWins: user.totalWins || 0,
  totalBattles: user.totalBattles || 0,
  rank: user.rank,
});
