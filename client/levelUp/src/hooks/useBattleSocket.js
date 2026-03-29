import { useState, useEffect, useRef } from "react";

/*
  useBattleSocket

  Manages:
  - battle state
  - opponent progress
  - result
  - communication with socket (later)

  For now it runs in MOCK mode so the UI works.
*/

export function useBattleSocket(battleId, userId) {
  const socketRef = useRef(null);
  const codeRef = useRef("");

  const [battleState, setBattleState] = useState({
    phase: "intro", // intro | battle | results
    problem: null,
    players: null,
    opponentProgress: 0,
    opponentStatus: "coding",
    result: null,
    isLoading: true,
  });

  /* MOCK DATA LOAD */
  useEffect(() => {
    const timer = setTimeout(() => {
      setBattleState((prev) => ({
        ...prev,

        problem: {
          title: "Binary Search",
          description:
            "Implement binary search to find a target element in a sorted array.",
          difficulty: "Medium",
          topic: "Binary Search",
          examples: [
            {
              input: "[1,3,5,7,9], target=5",
              output: "2",
            },
          ],
          constraintsList: ["1 ≤ arr.length ≤ 10⁴", "Array sorted ascending"],
        },

        players: {
          current: {
            userId: "u1",
            username: "rupal",
            rank: "Intermediate",
            totalWins: 24,
            totalBattles: 41,
          },

          opponent: {
            userId: "u2",
            username: "CodeNinja",
            rank: "Advanced",
            totalWins: 57,
            totalBattles: 89,
          },
        },

        isLoading: false,
      }));
    }, 800);

    return () => clearTimeout(timer);
  }, [battleId, userId]);

  /* MOCK OPPONENT PROGRESS */
  useEffect(() => {
    if (battleState.phase !== "battle") return;

    let progress = 5;

    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 6, 98);

      setBattleState((prev) => ({
        ...prev,
        opponentProgress: Math.round(progress),
        opponentStatus: progress > 80 ? "reviewing" : "typing",
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [battleState.phase]);

  /* START BATTLE */
  const startBattle = () => {
    setBattleState((prev) => ({
      ...prev,
      phase: "battle",
    }));
  };

  /* SUBMIT SOLUTION */
  const submitSolution = async(code, language) => {
    codeRef.current = code;

    // later this will emit socket event
    // socket.emit("submit_solution")

    // setTimeout(() => {
    //   setBattleState((prev) => ({
    //     ...prev,
    //     phase: "results",

    //     result: {
    //       winnerId: prev.players.current.userId,
    //       winnerUsername: prev.players.current.username,
    //       isWinner: true,
    //       timeTaken: 287,
    //       correct: true,
    //     },
    //   }));
    // }, 1500);
    
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      // 🔍 check result
      const expectedOutput = "2"; // later from problem
      const isCorrect = data.output?.trim() === expectedOutput;

      setBattleState((prev) => ({
        ...prev,
        phase: "results",
        result: {
          winnerId: isCorrect
            ? prev.players.current.userId
            : prev.players.opponent.userId,

          winnerUsername: isCorrect
            ? prev.players.current.username
            : prev.players.opponent.username,

          isWinner: isCorrect,
          timeTaken: 287,
          correct: isCorrect,
        },
      }));
    } catch (error) {
      console.error("Execution error:", error);
    }
  };

  /* UPDATE TYPING STATUS */
  const updateTypingStatus = (code) => {
    const progress = Math.min(Math.floor(code.length / 8), 99);

    // later socket emit
    // socket.emit("code_update")
  };

  return {
    battleState,
    startBattle,
    submitSolution,
    updateTypingStatus,
  };
}
