

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getBattleQuestion } from "../services/battleService";

export function useBattleSocket(battleId, userId, onSocketReady) {
  // ↑ accept a callback from orchestrator
  // ↑ accept a callback from orchestrator
  const socketRef = useRef(null);
  const codeRef = useRef("");
  const onReadyCalled = useRef(false);

  const [battleState, setBattleState] = useState({
    phase: "waiting",
    problem: null,
    players: null,
    opponentProgress: 0,
    opponentStatus: "coding",
    result: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!battleId) return;
let mounted = true;
    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // socket.on("connect", () => {
    //   console.log("✅ Socket connected:", socket.id);
    //   socket.emit("joinBattleRoom", battleId);

    //   // Fire the callback once so orchestrator can call joinBattleAPI
    //   if (!onReadyCalled.current) {
    //     onReadyCalled.current = true;
    //     onSocketReady?.();
    //   }
    // });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("joinBattleRoom", battleId);

      if (!onReadyCalled.current) {
        onReadyCalled.current = true;
        onSocketReady?.();
      }

      // ✅ Creator arrives after battle already started — fetch question directly
      // Check if battle is already ongoing by trying to load the question
      getBattleQuestion(battleId)
        .then((question) => {
          if (!mounted) return;
          setBattleState((prev) => {
            // Only update if we don't already have a problem loaded
            if (prev.problem) return prev;
            return {
              ...prev,
              phase: "intro",
              isLoading: false,
              problem: {
                ...question,
                // title: question.title,
                // description: question.description,
                // difficulty: question.difficulty,
                // topic: question.topic,
                // constraints: question.constraints,
                // sampleInput: question.sampleInput,
                // sampleOutput: question.sampleOutput,

                examples:
                  question.testCases?.public?.map((tc) => ({
                    input: tc.input,
                    output: tc.output,
                  })) || [],
                constraintsList: question.constraints
                  ? [question.constraints]
                  : [],
              },
             
            };
          });
        })
        .catch(() => {
          // Question not assigned yet (battle still waiting) — that's fine
          // battleStarted event will handle it when opponent joins
        });
    });
    socket.off("battleStarted");

    socket.on("battleStarted", async (data) => {
      console.log("🔥 battleStarted received:", data);

       if (!mounted) return; 

      try {
        const question = await getBattleQuestion(battleId);
        const isCreator = data.players.creator.id === userId;
        setBattleState((prev) => ({
          ...prev,
          phase: "intro",
          isLoading: false,
          problem: {
            ...question,
            // title: question.title,
            // description: question.description,
            // difficulty: question.difficulty,
            // topic: question.topic,
            // constraints: question.constraints,
            // sampleInput: question.sampleInput,
            // sampleOutput: question.sampleOutput,
            examples:
              question.testCases?.public?.map((tc) => ({
                input: tc.input,
                output: tc.output,
              })) || [],
            constraintsList: question.constraints ? [question.constraints] : [],
          },

          players: {
            current: isCreator ? data.players.creator : data.players.opponent,
            

            opponent: isCreator ? data.players.opponent : data.players.creator,
          },
          startTime: data.startTime,
          endTime: data.endTime,
        }));
      } catch (err) {
        console.error("Failed to load question:", err);
      }
    });

    socket.on("timerSync", (data) => {
      setBattleState((prev) => ({
        ...prev,
        startTime: data.startTime,
        endTime: data.endTime,
      }));
    });

    socket.on("submissionUpdate", (data) => {
      if (data.userId !== userId) {
        setBattleState((prev) => ({
          ...prev,
          opponentStatus: data.isCorrect ? "passed" : "failed",
        }));
      }
    });

    // socket.on("battleEnded", (data) => {
    //   setBattleState((prev) => ({
    //     ...prev,
    //     phase: "results",
    //     result: {
    //       winnerId: data.winnerId,
    //       isWinner: data.winnerId?.toString() === userId?.toString(),
    //     },
    //   }));
    // });
socket.on("battleEnded", (data) => {
  const isWinner = data.winnerId?.toString() === userId?.toString();

  let status;

  if (!data.winnerId) {
    status = "draw";
  } else if (isWinner) {
    status = "winner";
  } else {
    status = "defeated";
  }

  setBattleState((prev) => ({
    ...prev,
    phase: "results",
    result: {
      winnerId: data.winnerId,
      isWinner,
      status, // 👈 NEW
    },
  }));
});
    socket.on("extraTime", (data) => {
      setBattleState((prev) => ({
        ...prev,
        endTime: data.extendedEndTime,
      }));
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    return () => {
      mounted = false;
      socket.disconnect();
      onReadyCalled.current = false;
    };
  }, [battleId, userId]);

  const startBattle = () => {
    setBattleState((prev) => ({ ...prev, phase: "battle" }));
  };

  // const submitSolution = async (code, language) => {
  //   codeRef.current = code;
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await fetch(`/api/battle/${battleId}/submit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ code, language }),
  //     });
  //     const data = await res.json();
  //     console.log("Submit result:", data);
  //   } catch (error) {
  //     console.error("Submit error:", error);
  //   }
  // };
const submitSolution = async (code, language) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/battle/${battleId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, language }),
      },
    );

    const data = await res.json();

    console.log("Submit result:", data);

    // 👇 IMPORTANT: update UI
    // if (data.isCorrect) {
    //   socketRef.current.emit("correctSubmission", {
    //     battleId,
    //     userId,
    //   });
    // }
  } catch (error) {
    console.error("Submit error:", error);
  }
};
  const updateTypingStatus = () => {};

  return { battleState, startBattle, submitSolution, updateTypingStatus };
}