import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Facebook,
    Send,
    ArrowRight,
    ChevronDown,
    MapPin,
    Globe2,
    Users,
    FileBarChart,
    PieChart,
    BookOpen,
    Building2,
    Briefcase,
    Target,
    Map,
    UserCircle,
    Bell,
    ClipboardList,
    Cpu,
    Database,
    Zap
} from 'lucide-react';

const Logo = ({ className = "w-12 h-12" }) => (
    <div className={`${className} bg-slate-900/50 rounded-2xl flex items-center justify-center p-2 shadow-2xl border border-cyan-500/30 backdrop-blur-xl overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-slow">
            <defs>
                <linearGradient id="cyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cyanBlue)" strokeWidth="1" strokeDasharray="6 3" />
            <path d="M20 70 Q 35 30 50 70 T 80 70" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
            <path d="M20 70 Q 35 45 50 70 T 80 70" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            <circle cx="50" cy="50" r="12" fill="url(#cyanBlue)" className="shadow-lg shadow-cyan-500/50" />
        </svg>
    </div>
);

const NavItem = ({ title, children, hasDropdown = true, isActive = false, path }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li
            className="relative h-12 flex items-center group cursor-pointer"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Link
                to={path || "#"}
                className={`flex items-center gap-1 hover:text-cyan-400 font-bold text-[13px] tracking-wide transition-all ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}
            >
                {title} {hasDropdown && <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
            </Link>
            {isActive && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50"></div>}

            {hasDropdown && isOpen && (
                <div className="absolute top-12 left-0 min-w-[280px] bg-slate-900/95 text-slate-100 shadow-2xl rounded-b-2xl py-6 border-t-2 border-cyan-500/50 backdrop-blur-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 gap-1 px-2">
                        {children.map((item, i) => (
                            <Link
                                key={i}
                                to={item.path || "#"}
                                className="px-5 py-3 rounded-xl hover:bg-cyan-500/10 flex items-center gap-4 transition-all group/item border border-transparent hover:border-cyan-500/20"
                            >
                                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 group-hover/item:bg-gradient-to-br group-hover/item:from-cyan-500 group-hover/item:to-blue-500 group-hover/item:text-white transition-all duration-500 shadow-inner">
                                    {item.icon && <item.icon size={16} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-[11px] uppercase tracking-wider group-hover/item:text-cyan-300">{item.label}</span>
                                    {item.desc && <span className="text-[9px] text-slate-500 font-bold mt-1 leading-none group-hover/item:text-slate-400">{item.desc}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </li>
    );
};

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAmharic, setIsAmharic] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            alert(`Initiating system-wide scan for: ${searchQuery}\n(Backend neural link processing...)`);
            setSearchQuery('');
        }
    };

    const navData = [
        { title: isAmharic ? 'መነሻ' : 'Home', hasDropdown: false, path: '/' },
        {
            title: isAmharic ? 'ስለ ኢ.ስ.አ' : 'About ESS',
            path: '/about',
            items: [
                { label: 'Debre Berhan Branch', icon: Building2, desc: 'Regional Data Hub', path: '/about' },
                { label: 'History', icon: BookOpen, desc: 'Legacy since 1956', path: '/about/history' },
                { label: 'Management', icon: UserCircle, desc: 'Strategic Governance', path: '/about/structure' },
                { label: 'NSDS Roadmap', icon: Target, desc: 'Future Framework', path: '/about/strategies' }
            ]
        },
        {
            title: isAmharic ? 'መረጃዎች' : 'Find Statistics',
            path: '/stats/population',
            items: [
                { label: 'Demographics', icon: Users, desc: 'National Census Data', path: '/stats/population' },
                { label: 'Agri-Metrics', icon: PieChart, desc: 'Yield & Livestock', path: '/stats/agriculture' },
                { label: 'Economic Core', icon: FileBarChart, desc: 'GDP & Indices', path: '/stats/economy' },
                { label: 'Industry Scan', icon: Cpu, desc: 'Manufacturing data', path: '/stats/business' }
            ]
        },
        {
            title: isAmharic ? 'ዜናዎች' : 'News ESS',
            path: '/news',
            items: [
                { label: 'Core Bulletins', icon: Bell, desc: 'Official releases', path: '/news' },
                { label: 'Active Tenders', icon: Briefcase, desc: 'Sourcing data', path: '/tenders' },
                { label: 'Data Careers', icon: Cpu, desc: 'Join the mission', path: '/jobs' }
            ]
        },
        {
            title: isAmharic ? 'ሚዲያ' : 'Media',
            path: '/photo-gallery',
            items: [
                { label: 'Visual Archives', icon: Globe2, desc: 'Image repository', path: '/photo-gallery' },
                { label: 'Video Stream', icon: Zap, desc: 'Motion data', path: '/video-gallery' }
            ],
            isActive: true
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 -z-10"></div>
            <div className="fixed inset-0 opacity-20 -z-10" style={{
                backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
                backgroundSize: '80px 80px'
            }}></div>
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]"></div>

            {/* Top Header */}
            <header className="hidden md:block bg-slate-950/50 border-b border-cyan-500/10 backdrop-blur-xl relative z-[110]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-5 group">
                        <Logo className="w-14 h-14 transition-all group-hover:scale-110 shadow-3xl shadow-cyan-500/10" />
                        <div className="flex flex-col text-left">
                            <span className="text-[9px] font-black text-slate-500 tracking-[0.3em] leading-none mb-1 uppercase opacity-60">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                            <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-tighter">ETHIOPIAN STATISTICAL SERVICE</span>
                        </div>
                    </Link>

                    {/* Interaction Hub */}
                    <div className="flex items-center gap-6">
                        <form className="relative group/search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder={isAmharic ? "መረጃ ፈልግ..." : "Scan Data Grid..."}
                                className="pl-4 pr-12 py-2.5 w-72 bg-slate-900/50 border border-cyan-500/20 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-600 backdrop-blur-sm shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
                                <Search size={14} strokeWidth={3} />
                            </button>
                        </form>

                        <div className="flex items-center gap-4 border-x border-slate-800 px-6">
                            <button
                                onClick={() => setIsAmharic(!isAmharic)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group/lang"
                            >
                                <Globe2 size={14} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black tracking-widest text-slate-300">{isAmharic ? 'AM' : 'EN'}</span>
                            </button>
                            <div className="flex items-center gap-2">
                                <a href="#" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"><Facebook size={16} /></a>
                                <a href="#" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"><Send size={16} /></a>
                            </div>
                        </div>

                        <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-[12px] font-black shadow-xl shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest border border-cyan-400/30 flex items-center gap-2">
                            <Database size={14} /> Stat Bank
                        </Link>
                    </div>
                </div>
            </header>

            {/* Navigation Matrix */}
            <nav className="bg-slate-900/80 border-b border-cyan-500/20 sticky top-0 z-[105] backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6">
                    <ul className="flex items-center justify-center space-x-12 h-11">
                        {navData.map((nav, i) => (
                            <NavItem
                                key={i}
                                title={nav.title}
                                hasDropdown={nav.hasDropdown !== false}
                                isActive={nav.isActive}
                                path={nav.path}
                            >
                                {nav.items}
                            </NavItem>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Breadcrumbs Section */}
            <div className="bg-slate-950/30 border-b border-cyan-500/5 mb-16">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <nav className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-[0.3em]">
                        <Link to="/" className="text-slate-600 hover:text-cyan-400 transition-colors">Home</Link>
                        <span className="text-slate-800">/</span>
                        <span className="text-cyan-500/80 underline decoration-cyan-500/50 underline-offset-4">Media Grid</span>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 gap-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-cyan-500/20 shadow-lg shadow-cyan-500/5 animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div> System Active: Portal 04
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none m-0 uppercase flex flex-col">
                            <span>MEDIA</span>
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">INTERFACE</span>
                        </h1>
                        <div className="h-2 w-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30"></div>
                    </div>
                    <div className="max-w-sm text-left lg:text-right">
                        <p className="text-slate-400 font-bold leading-relaxed text-sm">
                            Access real-time multimedia repositories and official event streams from the ESS national data network.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Activity Cell: News */}
                    <Link to="/news" className="group relative bg-slate-900/40 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 border border-cyan-500/10 hover:border-cyan-500/40 flex items-stretch min-h-[160px] group drop-shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="w-2 bg-gradient-to-b from-cyan-600 to-blue-600 group-hover:w-3 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-10 flex items-center justify-between relative z-10">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-white group-hover:translate-x-3 transition-transform duration-500 tracking-tighter uppercase">News</h2>
                                <p className="text-cyan-400/50 font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">Broadcast Stream v1.02</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-400 transition-all duration-500 shadow-2xl group-hover:rotate-12 group-hover:scale-110">
                                <Zap size={32} strokeWidth={2.5} />
                            </div>
                        </div>
                    </Link>

                    {/* Activity Cell: Events */}
                    <Link to="/events" className="group relative bg-slate-900/40 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 border border-cyan-500/10 hover:border-cyan-500/40 flex items-stretch min-h-[160px] drop-shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="w-2 bg-gradient-to-b from-blue-600 to-indigo-600 group-hover:w-3 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-10 flex items-center justify-between relative z-10">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-white group-hover:translate-x-3 transition-transform duration-500 tracking-tighter uppercase">Events</h2>
                                <p className="text-blue-400/50 font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Scheduled Symposium Grid</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-all duration-500 shadow-2xl group-hover:rotate-12 group-hover:scale-110">
                                <Cpu size={32} strokeWidth={2.5} />
                            </div>
                        </div>
                    </Link>

                    {/* Activity Cell: Photo Gallery */}
                    <Link to="/photo-gallery" className="group relative bg-slate-900/40 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 border border-cyan-500/10 hover:border-cyan-500/40 flex items-stretch min-h-[160px] drop-shadow-2xl">
                        <div className="w-2 bg-slate-800 group-hover:bg-cyan-600 group-hover:w-3 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-10 flex items-center justify-between shrink-0 h-full relative z-10">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-white group-hover:translate-x-3 transition-transform duration-500 tracking-tighter uppercase">Photos</h2>
                                <p className="text-slate-600 font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">Visual Archive Database</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-400 transition-all duration-500 shadow-2xl group-hover:-rotate-12 group-hover:scale-110">
                                <Globe2 size={32} strokeWidth={2.5} />
                            </div>
                        </div>
                    </Link>

                    {/* Activity Cell: Video Gallery */}
                    <Link to="/video-gallery" className="group relative bg-slate-900/40 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 border border-cyan-500/10 hover:border-cyan-500/40 flex items-stretch min-h-[160px] drop-shadow-2xl">
                        <div className="w-2 bg-slate-800 group-hover:bg-blue-600 group-hover:w-3 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-10 flex items-center justify-between relative z-10">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-white group-hover:translate-x-3 transition-transform duration-500 tracking-tighter uppercase">Videos</h2>
                                <p className="text-slate-600 font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Motion Feed Repository</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-all duration-500 shadow-2xl group-hover:-rotate-12 group-hover:scale-110">
                                <Zap size={32} strokeWidth={2.5} />
                            </div>
                        </div>
                    </Link>
                </div>
            </main>

            {/* Footer Section: Deep Slate */}
            <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden border-t border-cyan-500/10 mt-12">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-20 mb-20">
                        {/* Company Identity */}
                        <div className="space-y-8">
                            <Link to="/" className="flex items-center space-x-6 group">
                                <Logo className="w-16 h-16 transition-all duration-700 shadow-3xl brightness-125" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-[0.4em] leading-none mb-1 text-slate-500 uppercase">የኢ.ስ.አ</span>
                                    <span className="text-2xl font-black leading-none uppercase tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent italic">
                                        ESS DATA<br /><span className="text-cyan-500 underline decoration-cyan-500/20 underline-offset-8">CORE</span>
                                    </span>
                                </div>
                            </Link>
                            <p className="text-slate-400 text-[13px] leading-relaxed max-w-sm font-bold opacity-80 border-l-2 border-cyan-500/30 pl-6 py-1">
                                Empowering the nation with high-fidelity statistical infrastructure since 1956.
                            </p>
                        </div>

                        {/* Navigation Matrix */}
                        <div className="text-left">
                            <h3 className="text-xs font-black mb-10 border-b-2 border-cyan-500/20 pb-2 inline-block uppercase tracking-[0.3em] text-cyan-500/80">Navigation Matrix</h3>
                            <div className="grid grid-cols-1 gap-5">
                                {[
                                    { label: 'Central Hub', path: '/' },
                                    { label: 'Regional Branches', path: '/about' },
                                    { label: 'Neural Stat Bank', path: '/login' },
                                    { label: 'Visual Archives', path: '/photo-gallery' }
                                ].map((item, i) => (
                                    <Link key={i} to={item.path} className="text-sm font-black text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-4 hover:translate-x-3 group/link">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover/link:bg-cyan-500 shadow-lg shadow-cyan-500/50 transition-colors"></div>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact Node */}
                        <div className="bg-slate-900/50 p-10 rounded-[2.5rem] backdrop-blur-3xl border border-cyan-500/10 shadow-3xl">
                            <h3 className="text-xs font-black mb-8 border-b-2 border-cyan-500/20 pb-2 inline-block uppercase tracking-[0.3em] text-cyan-500/80">Contact Node</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shadow-lg group-hover/item:bg-cyan-500 group-hover/item:text-white transition-all">
                                        <MapPin size={20} className="text-cyan-400 group-hover/item:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 leading-none">Primary HQ</p>
                                        <p className="text-sm font-black text-slate-300">Arada District, Piassa<br />Addis Ababa, ETH</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-cyan-500/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
                        <p>© 2026 ESS SYSTEM CORE // ALL PROTOCOLS RESERVED</p>
                        <div className="flex space-x-12 mt-8 md:mt-0">
                            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Security</span>
                            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Transparency</span>
                            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Link</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Global Smooth CSS Animations */}
            <style sx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.8; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.02); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
