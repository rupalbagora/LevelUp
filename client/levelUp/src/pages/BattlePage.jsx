import { useParams } from "react-router-dom";
import BattleOrchestrator from "../components/battle/BattleOrchestrator";

const MOCK_USER_ID = "u1";

export default function BattlePage() {
  const { battleId } = useParams();
  const resolvedBattleId = battleId || "battle_demo_123";

  return (
    <BattleOrchestrator battleId={resolvedBattleId} userId={MOCK_USER_ID} />
  );
}
