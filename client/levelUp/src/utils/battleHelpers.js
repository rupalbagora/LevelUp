// Format seconds into MM:SS
export function formatTime(seconds) {
  if (!seconds) return "00:00";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Generate avatar initials
export function getInitials(username = "") {
  return username.slice(0, 2).toUpperCase();
}

// Generate deterministic avatar color
export function getAvatarColor(username = "") {
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
  ];

  let hash = 0;

  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

// Difficulty colors
export function getDifficultyColor(diff) {
  const map = {
    Easy: "#22c55e",
    Medium: "#f59e0b",
    Hard: "#ef4444",
  };

  return map[diff] || "#94a3b8";
}

// Rank badge
export function getRankInfo(rank) {
  const ranks = {
    Beginner: { icon: "🥉", color: "#94a3b8" },
    Intermediate: { icon: "🥈", color: "#60a5fa" },
    Advanced: { icon: "🥇", color: "#f59e0b" },
    Expert: { icon: "💎", color: "#a855f7" },
    Master: { icon: "👑", color: "#ef4444" },
  };

  return ranks[rank] || ranks.Beginner;
}

// Starter code templates
export const STARTER_CODE = {
  javascript: `function solution(arr, target) {
  // write your code here
  
}`,

  python: `def solution(arr, target):
    # write your code here
    pass
`,

  java: `class Solution {
    public int solution(int[] arr, int target) {
        return -1;
    }
}`,
};

// Language selector options
export const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
];
