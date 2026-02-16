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
    ClipboardList
} from 'lucide-react';

const Logo = ({ className = "w-12 h-12" }) => (
    <div className={`${className} bg-white rounded-full flex items-center justify-center p-1.5 shadow-md border border-gray-100 overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d4e89" />
                    <stop offset="100%" stopColor="#2c75cc" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1d4e89" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M20 70 Q 35 30 50 70 T 80 70" fill="none" stroke="#b38a5d" strokeWidth="5" strokeLinecap="round" />
            <path d="M20 70 Q 35 45 50 70 T 80 70" fill="none" stroke="#1d4e89" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            <circle cx="50" cy="50" r="15" fill="url(#blueGrad)" />
            <path d="M45 50 L50 40 L55 50 Z" fill="white" />
        </svg>
    </div>
);

const NavItem = ({ title, children, hasDropdown = true, isActive = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li
            className="relative h-12 flex items-center group cursor-pointer"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className={`flex items-center gap-1 hover:text-blue-200 font-bold text-[13px] tracking-wide transition-colors ${isActive ? 'text-white' : 'text-blue-50'}`}>
                {title} {hasDropdown && <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
            </div>
            {isActive && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#b38a5d]"></div>}

            {hasDropdown && isOpen && (
                <div className="absolute top-12 left-0 min-w-[240px] bg-white text-[#1d4e89] shadow-2xl rounded-b-lg py-4 border-t-[3px] border-[#b38a5d] z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-1 gap-0.5">
                        {children.map((item, i) => (
                            <Link
                                key={i}
                                to={item.path || "#"}
                                className="px-5 py-2 hover:bg-slate-50 flex items-center gap-3 transition-all group/item border-l-4 border-transparent hover:border-[#1d4e89]"
                            >
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-[#1d4e89] group-hover/item:text-white transition-colors duration-300">
                                    {item.icon && <item.icon size={14} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xs uppercase tracking-tight leading-none group-hover/item:text-[#1d4e89]">{item.label}</span>
                                    {item.desc && <span className="text-[9px] text-gray-400 font-medium group-hover/item:text-gray-500 mt-1">{item.desc}</span>}
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
            alert(`Searching for: ${searchQuery}\n(Integrated search is coming soon)`);
            setSearchQuery('');
        }
    };

    const navData = [
        { title: isAmharic ? 'መነሻ' : 'Home', hasDropdown: false, path: '/' },
        {
            title: isAmharic ? 'ስለ ኢ.ስ.አ' : 'About ESS',
            items: [
                { label: 'Debre Berhan Branch', icon: Building2, desc: 'Regional branch overview', path: '/about' },
                { label: 'History', icon: BookOpen, desc: 'Our journey since 1956', path: '/about/history' },
                { label: 'Organization Structure', icon: Building2, desc: 'Governance and management', path: '/about/structure' },
                { label: 'Strategies', icon: Target, desc: 'NSDS and strategic plans', path: '/about/strategies' }
            ]
        },
        {
            title: isAmharic ? 'መረጃዎች' : 'Find Statistics',
            items: [
                { label: 'Population', icon: Users, desc: 'Census and projections', path: '/stats/population' },
                { label: 'Agriculture', icon: PieChart, desc: 'Crops and livestock data', path: '/stats/agriculture' },
                { label: 'Economy', icon: FileBarChart, desc: 'GDP and trade statistics', path: '/stats/economy' },
                { label: 'Business', icon: ClipboardList, desc: 'Industrial and commercial data', path: '/stats/business' }
            ]
        },
        {
            title: isAmharic ? 'ዜናዎች' : 'News ESS',
            items: [
                { label: 'Announcements', icon: BookOpen, desc: 'Official updates', path: '/news' },
                { label: 'Tenders', icon: Briefcase, desc: 'Procurement opportunities', path: '/tenders' },
                { label: 'Vacancies', icon: UserCircle, desc: 'Join our official team', path: '/jobs' }
            ]
        },
        {
            title: isAmharic ? 'ሚዲያ' : 'Media',
            items: [
                { label: 'Photo Gallery', icon: Globe2, desc: 'Event photography', path: '/photo-gallery' },
                { label: 'Video Gallery', icon: Globe2, desc: 'Official video content', path: '/video-gallery' },
                { label: 'Events', icon: Globe2, desc: 'Seminars and workshops', path: '/events' }
            ],
            isActive: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#f3f6f9] font-sans text-slate-900 overflow-x-hidden">
            {/* Top Header */}
            <div className="hidden md:block bg-white py-3 border-b border-gray-100 relative z-[110]">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-4 group">
                        <Logo className="w-14 h-14 transition-all group-hover:scale-105 shadow-md" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] leading-none mb-1 opacity-70 uppercase">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                            <span className="text-lg lg:text-2xl font-black text-[#1d4e89] leading-tight uppercase tracking-tighter">ETHIOPIAN STATISTICAL SERVICE</span>
                        </div>
                    </Link>

                    {/* Search and Social */}
                    <div className="flex items-center gap-6">
                        <div className="relative group/search">
                            <form className="flex items-center" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder={isAmharic ? "ፈልግ..." : "Search..."}
                                    className="pl-4 pr-10 py-2 w-64 border border-gray-200 rounded-l-md text-xs focus:outline-none focus:border-[#1d4e89] transition-all bg-slate-50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="px-4 py-2 h-[32px] bg-[#b38a5d] rounded-r-md text-white border border-[#b38a5d] hover:bg-[#a07a50] transition-all flex items-center justify-center">
                                    <Search size={16} strokeWidth={3} />
                                </button>
                            </form>
                        </div>

                        <div className="flex items-center gap-3 border-x border-slate-100 px-6">
                            <a href="https://facebook.com/essethiopia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1d4e89] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                                <Facebook size={16} fill="currentColor" />
                            </a>
                            <a href="https://t.me/ess_statistics" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1d4e89] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                                <Send size={16} fill="currentColor" />
                            </a>
                        </div>

                        <Link to="/login" className="bg-[#1d4e89] text-white px-6 py-2 rounded-md text-[13px] font-black hover:bg-[#153a66] shadow-lg shadow-blue-900/5 transition-all uppercase tracking-wider leading-none">
                            Stat Bank
                        </Link>
                    </div>
                </div>
            </div>

            {/* Blue Navigation Bar */}
            <nav className="bg-[#1d4e89] text-white shadow-lg relative z-[105]">
                <div className="max-w-7xl mx-auto px-6">
                    <ul className="flex items-center justify-center space-x-10 h-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {navData.map((nav, i) => (
                            <NavItem
                                key={i}
                                title={nav.title}
                                hasDropdown={nav.hasDropdown !== false}
                                isActive={nav.isActive}
                            >
                                {nav.items}
                            </NavItem>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Breadcrumbs Section */}
            <div className="bg-white border-b border-gray-100 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li><Link to="/" className="text-slate-400 hover:text-[#1d4e89] font-black uppercase text-[10px] tracking-[0.2em] transition-colors">Home</Link></li>
                            <li className="text-slate-200">/</li>
                            <li className="text-[#1d4e89] font-black uppercase text-[10px] tracking-[0.2em]">Media</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="flex items-end justify-between mb-12 gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-[#b38a5d]/10 text-[#b38a5d] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#b38a5d]/20">
                            <Globe2 size={10} /> Public Media Portal
                        </div>
                        <h1 className="text-5xl font-black text-[#1d4e89] tracking-tighter leading-none mb-2 uppercase">MEDIA</h1>
                        <div className="h-1.5 w-24 bg-[#b38a5d] rounded-full"></div>
                    </div>
                    <div className="hidden lg:block max-w-xs text-right">
                        <p className="text-slate-500 font-bold leading-relaxed text-sm">
                            Official multimedia archives and event coverage from the Ethiopian Statistical Service nationwide branches.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Activity Card: News */}
                    <Link to="/news" className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex items-stretch min-h-[140px]">
                        <div className="w-2 bg-[#1d4e89] group-hover:w-4 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-8 flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-500 tracking-tighter uppercase">News</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#b38a5d] transition-colors">Latest updates & announcements</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-45">
                                <ArrowRight size={28} strokeWidth={3} />
                            </div>
                        </div>
                    </Link>

                    {/* Activity Card: Events */}
                    <Link to="/events" className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex items-stretch min-h-[140px]">
                        <div className="w-2 bg-[#1d4e89] group-hover:w-4 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-8 flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-500 tracking-tighter uppercase">Events</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#b38a5d] transition-colors">Seminars, workshops & releases</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-45">
                                <ArrowRight size={28} strokeWidth={3} />
                            </div>
                        </div>
                    </Link>

                    {/* Activity Card: Photo Gallery */}
                    <Link to="/photo-gallery" className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex items-stretch min-h-[140px]">
                        <div className="w-2 bg-[#1d4e89] group-hover:w-4 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-8 flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-500 tracking-tighter uppercase">Photo Gallery</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#b38a5d] transition-colors">Visual archives from branches</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-45">
                                <ArrowRight size={28} strokeWidth={3} />
                            </div>
                        </div>
                    </Link>

                    {/* Activity Card: Video Gallery */}
                    <Link to="/video-gallery" className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex items-stretch min-h-[140px]">
                        <div className="w-1a h-1 bg-[#1d4e89] group-hover:w-4 transition-all duration-500 h-full"></div>
                        <div className="flex-1 p-8 flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-500 tracking-tighter uppercase">Video Gallery</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-[#b38a5d] transition-colors">Official video reports & media</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-45">
                                <ArrowRight size={28} strokeWidth={3} />
                            </div>
                        </div>
                    </Link>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="bg-[#1d4e89] text-white pt-20 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-16 mb-16">
                        {/* Company Info */}
                        <div className="space-y-8 group">
                            <Link to="/" className="flex items-center space-x-5">
                                <Logo className="w-16 h-16 transition-all duration-700 shadow-xl brightness-110" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-[0.2em] leading-none mb-1 opacity-60 uppercase">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                                    <span className="text-lg font-black leading-none uppercase tracking-tighter">ETHIOPIAN STATISTICAL<br /><span className="text-[#b38a5d]">SERVICE</span></span>
                                </div>
                            </Link>
                            <p className="text-blue-100 text-sm leading-relaxed max-w-sm font-bold italic opacity-85 border-l-4 border-[#b38a5d] pl-5 py-2">
                                "Providing reliable and timely statistical data for national planning and research excellence since 1956."
                            </p>
                        </div>

                        {/* Middle Links */}
                        <div className="text-left">
                            <h3 className="text-lg font-black mb-8 border-b-4 border-[#b38a5d] pb-1 inline-block uppercase tracking-widest text-[#b38a5d]">Navigation</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: 'Official Home', path: '/' },
                                    { label: 'About Branches', path: '/about' },
                                    { label: 'Statistical Portal', path: '/login' },
                                    { label: 'Media Center', path: '/photo-gallery' }
                                ].map((item, i) => (
                                    <Link key={i} to={item.path} className="text-base font-black text-blue-100 hover:text-white transition-all flex items-center gap-3 hover:translate-x-2 group/link">
                                        <ArrowRight size={16} className="text-[#b38a5d]" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact Panel */}
                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl">
                            <h3 className="text-lg font-black mb-6 border-b-4 border-[#b38a5d] pb-1 inline-block uppercase tracking-widest text-[#b38a5d]">Connect</h3>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="font-black text-[#b38a5d] uppercase tracking-[0.2em] text-[10px]">OFFICIAL HQ</p>
                                    <p className="text-white font-black text-lg tracking-tighter leading-tight">Ethiopian Statistical Service</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-[#b38a5d] flex items-center justify-center shadow-lg shrink-0">
                                        <MapPin size={18} className="text-white" />
                                    </div>
                                    <p className="font-black text-sm leading-snug tracking-tight">Arada Sub City, Piassa,<br />Addis Ababa, Ethiopia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-blue-300 font-black uppercase tracking-[0.3em] opacity-60">
                        <p>© 2026 ETHIOPIAN STATISTICAL SERVICE - ALL RIGHTS RESERVED</p>
                        <div className="flex space-x-10 mt-6 md:mt-0">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Transparency</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
