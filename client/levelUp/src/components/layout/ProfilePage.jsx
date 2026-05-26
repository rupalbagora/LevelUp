import React, { useState, useEffect, useMemo ,useRef} from 'react';
import { useSelector } from "react-redux";
import { Settings, Share2, Edit3, Trophy, Target, Award, Flame, Zap, Target as TargetIcon } from 'lucide-react';
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth-slice/authSlice";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
 // Path check kar lena apne folder ke hisaab se



// --- MOCK DATA ---
const statsSummary = [
  { label: 'Global Rank', value: '#342', icon: <Trophy className="text-[#2563eb] dark:text-cyan-400 w-5 h-5" /> },
  { label: 'Total Battles', value: '47', icon: <Target className="text-green-600 dark:text-green-400 w-5 h-5" /> },
  { label: 'Win Rate', value: '68%', icon: <Award className="text-orange-500 w-5 h-5" /> },
  { label: 'Current Streak', value: '5', icon: <Flame className="text-green-500 dark:text-cyan-400 w-5 h-5" /> },
];
const badgesData = [
  { name: 'First Victory', date: 'Sep 15, 2024', emoji: '🏆', locked: false },
  { name: 'Speed Demon', date: 'Sep 20, 2024', emoji: '⚡', locked: false },
  { name: '5 Win Streak', date: 'Oct 1, 2024', emoji: '🔥', locked: false },
  { name: 'Binary Master', date: 'Oct 3, 2024', emoji: '🎯', locked: false },
  { name: 'Top 500', date: 'Oct 4, 2024', emoji: '👑', locked: false },
  { name: 'DP Wizard', date: 'Locked', emoji: '🧙‍♂️', locked: true },
  { name: '100 Wins', date: 'Locked', emoji: '💯', locked: true },
  { name: 'Perfect Week', date: 'Locked', emoji: '✨', locked: true },
];
const activityData = [
  { type: 'Victory', vs: 'CodeNinja92', topic: 'Binary Search', time: '2 hours ago' },
  { type: 'Victory', vs: 'AlgoMaster', topic: 'Arrays', time: '1 day ago' },
  { type: 'Defeat', vs: 'DPDynamo', topic: 'Dynamic Programming', time: '2 days ago' },
];
const topicMasteryData = [
  { topic: 'Arrays & Strings', completed: 12, progress: 85 },
  { topic: 'Binary Search', completed: 10, progress: 95 },
  { topic: 'Dynamic Programming', completed: 5, progress: 45 },
  { topic: 'Trees & Graphs', completed: 9, progress: 60 },
  { topic: 'Sorting', completed: 11, progress: 75 },
];
const performanceInsights = [
  { title: 'Best Streak', value: '8 Wins', date: 'Sep 25 - Sep 28', icon: <Flame/>, color: 'green' },
  { title: 'Fastest Win', value: '1m 32s', date: 'Binary Search - Easy', icon: <Zap/>, color: 'blue' },
  { title: 'Most Wins Topic', value: 'Arrays', date: '15 Wins', icon: <TargetIcon/>, color: 'orange' },
];
// --- ANIMATION VARIANTS ---
const tabContentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
const LANGUAGES = [
  "Java", "JavaScript", "Python", "TypeScript",
  "C++", "C", "C#", "SQL", "Go",
  "Rust", "Kotlin", "Swift", "R", ".NET"
];
const AVATARS = ['🦁','🐱','🐶','🐼','🐸','🐵','🐯','🦊','🐻','🐨','🐰','🐹'];



// --- SUB-COMPONENTS ---
const BadgesSection = () => (
  <motion.div 
    initial="hidden" 
    animate="visible" 
    exit="exit" 
    variants={tabContentVariants} 
    className="bg-white dark:bg-[#050816] rounded-3xl p-9 border border-gray-100 dark:border-white/5 shadow-sm"
  >
    <div className="mb-10 pb-3 border-b border-gray-100 dark:border-white/5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Achievement Badges</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Unlock badges by completing challenges</p>
    </div>
    
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {badgesData.map((badge, idx) => (
        <motion.div 
          key={idx} 
          variants={itemVariants} 
          whileHover={badge.locked ? {} : { 
            y: -8, 
            rotate: -2,
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 } 
          }}
          className={`relative p-6 rounded-2xl border text-center transition-all duration-300 group cursor-pointer overflow-hidden
            ${badge.locked 
              ? 'bg-gray-50/50 dark:bg-white/5 opacity-40 border-gray-100 dark:border-white/5 grayscale cursor-not-allowed' 
              : 'bg-[#dbeafe]/20 dark:bg-cyan-950/10 border-blue-100 dark:border-cyan-500/20 hover:border-blue-400 dark:hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] shadow-inner backdrop-blur-sm'
            }`}
        >
          {/* Subtle Background Glow on Hover */}
          {!badge.locked && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/5 group-hover:to-purple-500/5 transition-all duration-500" />
          )}

          <motion.div 
            whileHover={badge.locked ? {} : { scale: 1.2, rotate: 5 }}
            className={`text-5xl mb-4 relative z-10 transition-transform duration-300 ${badge.locked ? 'opacity-50' : 'drop-shadow-lg'}`}
          >
            {badge.emoji}
          </motion.div>
          
          <div className={`relative z-10 font-bold text-sm transition-colors duration-300 ${badge.locked ? 'text-slate-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400'}`}>
            {badge.name}
          </div>
          
          <div className="relative z-10 text-[10px] text-slate-400 mt-1.5 uppercase font-bold tracking-wider">
            {badge.locked ? <span className="text-rose-400/70">Locked</span> : badge.date}
          </div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
const ActivitySection = () => (
  <motion.div initial="hidden" animate="visible" exit="exit" variants={tabContentVariants} className="bg-white dark:bg-[#050816] rounded-3xl p-9 border border-gray-100 dark:border-white/5 shadow-sm">
    <div className="mb-8 pb-3 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
      <span className="text-xs font-bold text-[#2563eb] dark:text-cyan-400 bg-blue-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full">Last 30 Days</span>
    </div>
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      {activityData.map((act, idx) => (
        <motion.div 
          key={idx} 
          variants={itemVariants} 
          whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
          className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden
            ${act.type === 'Victory' 
              ? 'bg-green-50/30 dark:bg-green-500/5 border-green-100/50 dark:border-green-500/10 hover:border-green-400' 
              : 'bg-red-50/30 dark:bg-red-500/5 border-red-100/50 dark:border-red-500/10 hover:border-red-400'}`}
        >
          {/* Side Indicator Line */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2 ${act.type === 'Victory' ? 'bg-green-500' : 'bg-red-500'}`} />

          <div className="flex items-center gap-5 relative z-10">
            <div className={`p-3 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${act.type === 'Victory' ? 'bg-white dark:bg-green-950/50 text-green-600 shadow-green-200/50' : 'bg-white dark:bg-red-950/50 text-red-600 shadow-red-200/50'}`}>
              {act.type === 'Victory' ? <Trophy size={24} className="drop-shadow-sm"/> : <Target size={24} className="drop-shadow-sm"/>}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-900 dark:text-white tracking-tight">{act.type} <span className="text-slate-400 font-medium">vs</span> {act.vs}</p>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{act.topic}</p>
            </div>
          </div>
          <div className="text-right relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{act.time}</p>
            <div className={`text-[10px] mt-1 font-bold ${act.type === 'Victory' ? 'text-green-500' : 'text-red-500'}`}>
              {act.type === 'Victory' ? '+25 XP' : '-10 XP'}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
const StatsSection = () => (
  <motion.div initial="hidden" animate="visible" exit="exit" variants={tabContentVariants} className="grid md:grid-cols-2 gap-8">
    <div className="bg-white dark:bg-[#050816] rounded-3xl p-9 border border-gray-100 dark:border-white/5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Topic Mastery</h2>
      <motion.div variants={containerVariants} className="mt-8 space-y-6">
        {topicMasteryData.map((topic, i) => (
          <motion.div key={i} variants={itemVariants}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{topic.topic}</span>
              <span className="font-bold text-xs text-[#2563eb] dark:text-cyan-400">{topic.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden shadow-inner">
              <motion.div initial={{ width: 0 }} animate={{ width: `${topic.progress}%` }} transition={{ duration: 1 }} className="bg-[#2563eb] h-full rounded-full"/>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
    <div className="bg-white dark:bg-[#050816] rounded-3xl p-9 border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Performance Insights</h2>
      {performanceInsights.map((insight, i) => {
        const colors = {
          green: 'bg-green-100 dark:bg-green-950/50 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300',
          blue: 'bg-blue-100 dark:bg-cyan-950/30 border-blue-200 dark:border-cyan-900 text-[#2563eb] dark:text-cyan-300',
          orange: 'bg-orange-100 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-300',
        };
        return (
          <motion.div key={i} whileHover={{ x: 4 }} className={`flex items-center gap-4 p-5 rounded-2xl border shadow-inner ${colors[insight.color]}`}>
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5">{insight.icon}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">{insight.title}</p>
              <p className="text-2xl font-black mt-0.5 tracking-tight">{insight.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);
 
// --- PASSWORD STRENGTH CHECKER ---
const getPasswordStrength = (password) => {
  if (!password) return null;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  if (passed <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%', textColor: 'text-red-500' };
  if (passed <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%', textColor: 'text-yellow-500' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%', textColor: 'text-green-500' };
};
 
// --- MAIN PROFILE PAGE COMPONENT ---
const ProfilePage = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth || {});
  

  // ✅ FIX 1: initial empty rakho (user async aata hai)
  const [formData, setFormData] = useState({
  username: '',
  bio: '',
  language: [], 
  github: '',
  linkedin: '',
  avatar: '🦁'
});

  // ✅ FIX 2: user load hone ke baad form update karo
  useEffect(() => {
  if (user) {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      language: user.language || [],
      github: user.github || '',
      linkedin: user.linkedin || '',
      avatar: user.avatar || '🦁'
    });
  }
}, [user]);

  // ✅ optional UX: ESC se sidebar close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsEditSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (langRef.current && !langRef.current.contains(event.target)) {
      setIsLangOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const dispatch = useDispatch();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.put("/api/user/update", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    dispatch(setUser(res.data.user));
    alert("Profile Updated Successfully!");
    setIsEditSidebarOpen(false);

  } catch (err) {
    console.log(err);
    alert("Update failed");
  }
};

  // ✅ FIX 3: SSR safe
const profileUrl = typeof window !== "undefined"
  ? `${window.location.origin}/user/${user?.username}`
  : "";

const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(profileUrl);
    alert("Profile link copied!");
  } catch (err) {
    alert("Copy failed!");
  }
};
const [isShared, setIsShared] = useState(false);

const handleLinkedInShare = () => {
  // 1. Data collect karein (Rank aur Top 3 Skills)
  const userRank = "#342"; // Ise dynamic user.rank se replace karein
  const topSkills = formData.language.slice(0, 3).join(", ");
  
  // 2. Ek badhiya Professional Caption banayein
  const caption = `🚀 Excited to share my technical profile on Level Up! 

🏆 Global Rank: ${userRank}
💻 Top Skills: ${topSkills}
📍 Checkout my full coding journey here: `;

  // 3. LinkedIn Feed URL (Ye directly post box kholta hai)
  const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption + profileUrl)}`;
  
  // 4. Open in new tab
  window.open(shareUrl, '_blank', 'noreferrer');

  // 5. Visual Confirmation
  setIsShared(true);
  setTimeout(() => setIsShared(false), 3000);
};

const [activeTab, setActiveTab] = useState('Badges');

  // ✅ performance optimize
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'Badges': return <BadgesSection />;
      case 'Activity': return <ActivitySection />;
      case 'Stats': return <StatsSection />;
      default: return null;
    }
  }, [activeTab]);

  const handleSelectLanguage = (lang) => {
  if (!formData.language.includes(lang)) {
    setFormData({
      ...formData,
      language: [...formData.language, lang]
    });
  }
};

const handleRemoveLanguage = (lang) => {
  setFormData({
    ...formData,
    language: formData.language.filter(l => l !== lang)
  });
};

  return (
    <div className="min-h-screen pt-24 pb-12 transition-colors duration-500 bg-gray-50 dark:bg-[#050816]">
      <div className="max-w-7xl mx-auto px-6 ">
        
        

        {/* === MAIN PROFILE CARD === */}
        <div className="bg-white dark:bg-[#050816] rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg overflow-hidden mb-10">
          <div className="h-44 w-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed]"/>
          <div className="relative px-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-8 gap-5">
              <div className="flex items-end gap-6">
                
                {/* LION AVATAR WITH UPWARD HOVER EFFECT */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-36 h-36 rounded-full border-[6px] border-white dark:border-[#050816] bg-[#dbeafe] dark:bg-slate-800 flex items-center justify-center text-6xl shadow-xl cursor-pointer"
                >
                  {user?.avatar || '🦁'}
                </motion.div>

                <div className="mb-2">
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
  {user?.username || "Username"}
</h1>
                  <div className="flex items-center gap-5 text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                    <span>📧 {user?.email || "email@example.com"}</span>
                    <span>📅 Joined Sep 2024</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (Settings moved here) */}
              <div className="flex items-center gap-2.5 mb-2">
                <button 
  onClick={() => setIsEditSidebarOpen(true)}
  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
>
  <Edit3 size={16}/> Edit
</button>
                <button 
  onClick={() => setIsShareModalOpen(true)} // Ye line connect karni hai
  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
>
  <Share2 size={16}/> Share
</button>
                {/* SETTINGS BUTTON INTEGRATED HERE */}
                <button className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* === UPDATED LAYOUT: COMPACT & BALANCED === */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start border-t border-gray-100 dark:border-white/5 pt-10 px-2">
              
              {/* LEFT SIDE: Bio, Expertise + Socials (7 columns) */}
              <div className="lg:col-span-7 space-y-8 text-left">
                
                {/* Bio Section */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Bio</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xl font-medium">
                    {user?.bio || "No bio added yet"}
                  </p>
                </div>

                {/* Expertise & Socials side-by-side */}
                <div className="flex flex-wrap items-start gap-12">
                  {/* Expertise */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {(user?.language || []).map((tech) => (
  <span key={tech} className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-[#2563eb] dark:text-cyan-400 rounded-lg text-[10px] font-bold border">
    {tech}
  </span>
))}
                    </div>
                  </div>

                  {/* Social Profiles next to Expertise */}
                  <div className="flex gap-2.5">
  {/* GitHub */}
  {formData.github && (
    <a 
      href={formData.github} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-9 h-9 bg-slate-900 dark:bg-white/10 rounded-xl flex items-center justify-center text-[10px] text-white font-bold hover:scale-110 transition-transform shadow-md"
    >
      GH
    </a>
  )}

  {/* LinkedIn */}
  {formData.linkedin && (
    <a 
      href={formData.linkedin} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-9 h-9 bg-[#0077b5] rounded-xl flex items-center justify-center text-[10px] text-white font-bold hover:scale-110 transition-transform shadow-md"
    >
      LN
    </a>
  )}

  {/* Extra icon */}
  <a 
    href="#" 
    className="w-9 h-9 bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-500 hover:scale-110 transition-transform"
  >
    <Zap size={14} />
  </a>
</div>
                </div>
              </div>

              {/* RIGHT SIDE: Compact Stats boxes (5 columns) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-5">
                {statsSummary.map((s, i) => (
                  <div key={i} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3 rounded-2xl flex items-center gap-3 shadow-sm hover:border-blue-200 dark:hover:border-cyan-500/30 transition-all group">
                    <div className="p-2 bg-gray-50 dark:bg-white/10 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                      {s.icon}
                    </div>
                    <div className="text-left overflow-hidden">
                      <div className="text-base font-black text-slate-900 dark:text-white leading-tight truncate">{s.value}</div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* === TABS NAVIGATION === */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100/70 dark:bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-gray-100 dark:border-white/5 backdrop-blur-sm shadow-inner">
            {['Badges', 'Activity', 'Stats'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-white dark:bg-white/10 text-[#2563eb] dark:text-cyan-400 shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {renderTabContent}
        </AnimatePresence>

      </div>
      <AnimatePresence>
  {isShareModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="bg-white dark:bg-[#0b1120] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10"
    >
      {/* Header with Avatar & Rank */}
      <div className="p-8 bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white relative">
        <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full font-bold">✕</button>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center text-4xl shadow-2xl">
            {formData.avatar}
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">{user?.username}</h3>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
              <Trophy size={12}/> Global Rank: #342
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Copy Link Section */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Profile Link</label>
          <div className="flex gap-2 p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-inner">
            <input readOnly value={profileUrl} className="bg-transparent flex-1 text-sm px-3 text-slate-600 dark:text-slate-300 outline-none overflow-hidden text-ellipsis"/>
            <button onClick={handleCopyLink} className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Copy
            </button>
          </div>
        </div>

        {/* LinkedIn Share Button */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Share Achievement</label>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleLinkedInShare}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 
              ${isShared ? 'bg-green-500 text-white' : 'bg-[#0077b5] hover:bg-[#005885] text-white'}`}
          >
            {isShared ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                ✅ Shared to LinkedIn!
              </motion.div>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Post to LinkedIn
              </>
            )}
          </motion.button>
          <p className="text-center text-[10px] text-slate-400 italic">
            Skills & Rank will be included in your post automatically.
          </p>
        </div>
      </div>
    </motion.div>
  </div>
)}
</AnimatePresence>


{/* --- EDIT PROFILE SIDEBAR --- */}
<AnimatePresence>
  {isEditSidebarOpen && (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsEditSidebarOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
      />

      {/* Sidebar Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-[#050816] border-l border-gray-100 dark:border-white/10 z-[120] shadow-2xl p-8 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edit Profile</h2>
            <p className="text-slate-500 text-sm mt-1">Update your presence on Level Up</p>
          </div>
          <button 
            onClick={() => setIsEditSidebarOpen(false)}
            className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Change */}
          <div className="flex flex-col items-center gap-4 py-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
            <div 
  onClick={() => setIsAvatarOpen(true)}
  className="w-24 h-24 rounded-full bg-blue-100 dark:bg-cyan-500/10 flex items-center justify-center text-5xl shadow-inner relative group cursor-pointer"
>
               {formData.avatar}
               <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-xs text-white font-bold">Change</span>
               </div>
            </div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Profile Avatar</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <input 
  type="text"
  name="username"
  value={formData.username}
  onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white outline-none focus:border-[#2563eb] dark:focus:border-cyan-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Short Bio</label>
              <textarea 
  name="bio"
  value={formData.bio}
  onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white outline-none focus:border-[#2563eb] dark:focus:border-cyan-400 transition-all resize-none"
              />
            </div>

            <div ref={langRef} className="space-y-2 relative">
  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
    Preferred Language
  </label>

  {/* Selected Tags */}
  <div 
    onClick={() => setIsLangOpen(!isLangOpen)}
    className="w-full min-h-[50px] flex flex-wrap gap-2 items-center px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl cursor-pointer"
  >
    {formData.language.length === 0 && (
      <span className="text-gray-400 text-sm">Select languages...</span>
    )}

    {formData.language.map((lang) => (
      <div 
        key={lang}
        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
      >
        {lang}
        <span 
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveLanguage(lang);
          }}
          className="cursor-pointer text-red-500 ml-1"
        >
          ✕
        </span>
      </div>
    ))}
  </div>

  {/* Dropdown */}
  {isLangOpen && (
    <div className="absolute z-50 mt-2 w-full bg-white dark:bg-[#0b1120] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
      {LANGUAGES.map((lang) => (
        <div
          key={lang}
          onClick={() => handleSelectLanguage(lang)}
          className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-white/10 cursor-pointer text-sm"
        >
          {lang}
        </div>
      ))}
    </div>
  )}
</div>
          </div>

          {/* Social Connections */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white ml-1">Social Profiles</h3>
            <div className="flex gap-4">
               <div className="flex-1 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center gap-3">
                  <div className="flex-1 space-y-2">
  <label className="text-xs font-bold">GitHub</label>
  <input 
    name="github"
    value={formData.github}
    onChange={handleChange}
    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border"
  />
</div>
                  <span className="text-xs font-medium text-slate-400">GitHub</span>
               </div>
               <div className="flex-1 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center gap-3">
                  <div className="flex-1 space-y-2">
  <label className="text-xs font-bold">Linkedin</label>
  <input 
    name="linkedin"
    value={formData.linkedin}
    onChange={handleChange}
    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border"
  />
</div>
                  <span className="text-xs font-medium text-slate-400">LinkedIn</span>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-10">
            <button 
              type="button"
              onClick={() => setIsEditSidebarOpen(false)}
              className="flex-1 px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )}
</AnimatePresence>
{/* --- AVATAR SELECTION MODAL --- */}
<AnimatePresence>
  {isAvatarOpen && (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#0b1120] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Avatar</h3>
          <button onClick={() => setIsAvatarOpen(false)} className="text-slate-400 hover:text-red-500">✕</button>
        </div>
        
        <div className="p-6 grid grid-cols-4 gap-4">
          {AVATARS.map((emoji, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setFormData({ ...formData, avatar: emoji });
                setIsAvatarOpen(false);
              }}
              className={`text-3xl p-3 flex items-center justify-center rounded-2xl cursor-pointer transition-all
                ${formData.avatar === emoji 
                  ? 'bg-blue-100 dark:bg-blue-500/20 border-2 border-blue-500' 
                  : 'bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                }`}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-white/5 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            Select an emoji to update your profile
          </p>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
};

export default ProfilePage;