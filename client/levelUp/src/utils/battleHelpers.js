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
  python3: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1, l2):
        # write your code here
        pass
`,

  javascript: `/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function addTwoNumbers(l1, l2) {
  // write your code here
}
`,

  java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // write your code here
        return null;
    }
}`,

  cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // write your code here
        return nullptr;
    }
};`,
};

// Language selector options
export const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

// Monaco language id mapping
export const MONACO_LANGUAGE_MAP = {
  python3: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
};

// Mock testcases for console panel
export const MOCK_TESTCASES = [
  {
    id: 1,
    label: "Case 1",
    inputs: { l1: "[2,4,3]", l2: "[5,6,4]" },
    expected: "[7,0,8]",
  },
  {
    id: 2,
    label: "Case 2",
    inputs: { l1: "[0]", l2: "[0]" },
    expected: "[0]",
  },
  {
    id: 3,
    label: "Case 3",
    inputs: { l1: "[9,9,9,9,9,9,9]", l2: "[9,9,9,9]" },
    expected: "[8,9,9,9,0,0,0,1]",
  },
];
