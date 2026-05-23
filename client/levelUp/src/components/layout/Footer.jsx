import React from "react";
import { 
  Swords, Github, Linkedin, Youtube, Twitter, 
  Mail, MapPin, Phone, ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-[#03050a] text-slate-600 dark:text-slate-400 pt-16 pb-8 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Logo & Contact */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-[#7000ff] rounded-lg group-hover:shadow-[0_0_15px_rgba(112,0,255,0.5)] transition-all">
              <Swords className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              LEVEL <span className="text-[#7000ff] dark:text-[#00d4ff]">UP</span>
            </span>
          </div>
          
          <div className="space-y-4 text-sm leading-relaxed font-medium">
            <p className="flex items-start gap-3 group">
              <MapPin className="w-5 h-5 text-[#7000ff] dark:text-[#00d4ff] shrink-0" />
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Indore, Madhya Pradesh, <br />India - 452001</span>
            </p>
            <p className="flex items-center gap-3 group">
              <Mail className="w-5 h-5 text-[#7000ff] dark:text-[#00d4ff]" />
              <a href="mailto:help@levelup.com" className="hover:text-[#7000ff] dark:hover:text-[#00d4ff] transition-colors">help@levelup.com</a>
            </p>
            <p className="flex items-center gap-3 group">
              <Phone className="w-5 h-5 text-[#7000ff] dark:text-[#00d4ff]" />
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">+91 99999 88888</span>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Find us online</p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" className="hover:text-[#7000ff] dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_#fff] transition-all"><Github className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" className="hover:text-blue-600 dark:hover:text-[#00d4ff] dark:hover:drop-shadow-[0_0_8px_#00d4ff] transition-all"><Linkedin className="w-5 h-5" /></a>
              <a href="https://youtube.com" target="_blank" className="hover:text-red-500 dark:hover:text-red-400 dark:hover:drop-shadow-[0_0_8px_#ef4444] transition-all"><Youtube className="w-5 h-5" /></a>
              <a href="https://twitter.com" target="_blank" className="hover:text-sky-500 dark:hover:text-sky-400 dark:hover:drop-shadow-[0_0_8px_#38bdf8] transition-all"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Column 2: Roadmaps */}
        <div className="space-y-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Roadmaps</h4>
          <ul className="space-y-3 text-sm font-semibold">
            {['Learn Python', 'Learn Java', 'Learn C++', 'Data Structures & Algorithms', 'Competitive Programming'].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-[#7000ff] dark:hover:text-[#00d4ff] flex items-center gap-1 group transition-colors">
                  {item} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Compilers */}
        <div className="space-y-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Compilers</h4>
          <ul className="space-y-3 text-sm font-semibold">
            {['C++ online compiler', 'Java online compiler', 'Python online compiler', 'JavaScript online compiler', 'SQL online compiler'].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-[#7000ff] dark:hover:text-[#00d4ff] hover:translate-x-1 transition-all inline-block">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Company */}
        <div className="space-y-6">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-3 text-sm font-semibold">
            {['About us', 'For Colleges', 'Coding Contests', 'Blogs', 'Contact us', 'Privacy Policy', 'FAQs'].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-[#7000ff] dark:hover:text-[#00d4ff] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <p>© 2026 Level Up Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-[#7000ff] dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-[#7000ff] dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;