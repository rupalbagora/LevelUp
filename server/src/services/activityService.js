import User from "../models/User.js";

export const getDateKey = (date = new Date()) => {
  return date.toISOString().slice(0, 10);
};

export const getActivityLevel = (count) => {
  if (!count || count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
};

export const recordDailyActivity = async (userId) => {
  if (!userId) return null;

  const user = await User.findById(userId);
  if (!user) return null;

  const today = getDateKey();
  const yesterday = getDateKey(new Date(Date.now() - 86400000));

  let activityLog = [...(user.activityLog || [])];
  const existing = activityLog.find((entry) => entry.date === today);

  if (existing) {
    existing.count += 1;
  } else {
    activityLog.push({ date: today, count: 1 });
  }

  activityLog = activityLog
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 365);

  let dailyStreak = user.currentDailyStreak || 0;

  if (user.lastActiveDate !== today) {
    if (user.lastActiveDate === yesterday) {
      dailyStreak += 1;
    } else {
      dailyStreak = 1;
    }
  }

  user.activityLog = activityLog;
  user.lastActiveDate = today;
  user.currentDailyStreak = dailyStreak;
  user.longestDailyStreak = Math.max(user.longestDailyStreak || 0, dailyStreak);
  await user.save();

  return {
    dailyStreak: user.currentDailyStreak,
    longestDailyStreak: user.longestDailyStreak,
  };
};

export const buildActivityCalendar = (user) => {
  const logMap = {};
  (user.activityLog || []).forEach(({ date, count }) => {
    logMap[date] = count;
  });

  const days = [];
  for (let i = 34; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const dateKey = getDateKey(d);
    const count = logMap[dateKey] || 0;
    days.push({
      date: dateKey,
      count,
      level: getActivityLevel(count),
    });
  }

  const weeks = [];
  for (let w = 0; w < 5; w += 1) {
    weeks.push(days.slice(w * 7, w * 7 + 7));
  }

  const today = new Date();
  const monthLabel = today
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();

  return {
    weeks,
    monthLabel,
    dailyStreak: user.currentDailyStreak || 0,
    longestDailyStreak: user.longestDailyStreak || 0,
  };
};
