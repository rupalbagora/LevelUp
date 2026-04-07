import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swords, XCircle, Zap, ShieldAlert } from "lucide-react";
import { joinBattleAPI} from "../../../services/battleService";

const OpponentMatchIntro = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [battleData, setBattleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattleInfo = async () => {
      try {
        const response = await joinBattleAPI(battleId);
        // Check if battle is already finished, cancelled or expired
        if (response.status === "cancelled" || response.status === "expired" || response.status === "completed") {
          setBattleData({ status: "expired" });
        } else {
          setBattleData(response);
        }
      } catch (err) {
        setBattleData({ status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchBattleInfo();
  }, [battleId]);

  const handleAccept = async () => {
  try {
    const res = await acceptBattleAPI(battleId);
    if (res.status === "ongoing") {
      navigate(`/battle/${battleId}`); // Editor page ka link
    }
  } catch (err) {
    alert("Could not accept challenge.");
  }
};

  const handleDecline = async () => {
    try {
      await terminateBattleAPI(battleId);
      navigate("/dashboard");
    } catch (err) {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white font-black tracking-widest uppercase">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading Challenge...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-[#0b0f1a] border border-white/10 p-10 rounded-[3rem] shadow-2xl text-center backdrop-blur-sm"
      >
        {battleData?.status === "expired" || battleData?.status === "error" ? (
          <>
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
              <ShieldAlert size={40} className="text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 italic uppercase tracking-tighter">Link Expired!</h2>
            <p className="text-slate-400 mb-8 font-medium">This battle is no longer available. Either the 2-minute timer ran out or it was cancelled.</p>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/5"
            >
              RETURN TO DASHBOARD
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <Swords size={48} className="text-blue-500" />
            </div>
            
            <h2 className="text-4xl font-black text-white mb-2 italic uppercase tracking-tighter">Challenge!</h2>
            <p className="text-blue-500/60 mb-10 text-xs font-black uppercase tracking-[0.3em]">Prepare for the Duel</p>

            {/* Topic & Difficulty Cards */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 text-left">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">Topic</span>
                <p className="text-white font-bold truncate">{battleData?.topic || "Mixed DSA"}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 text-left">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">Level</span>
                <p className="text-emerald-400 font-bold uppercase">{battleData?.difficulty || "Medium"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                className="w-full bg-blue-700 py-5 rounded-[1.5rem] text-white font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-colors"
              >
                Accept & Fight <Zap size={20} fill="currentColor" />
              </motion.button>
              
              <button 
                onClick={handleDecline}
                className="w-full py-4 text-slate-500 font-bold hover:text-rose-500 transition-colors flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                <XCircle size={18} /> Decline Challenge
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OpponentMatchIntro;