import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Facebook,
    Send,
    ArrowRight,
    ChevronDown,
    MapPin,
    Globe2
} from 'lucide-react';

const Logo = ({ className = "w-14 h-14" }) => (
    <div className={`${className} bg-white rounded-full flex items-center justify-center p-1 shadow-inner border border-gray-100 overflow-hidden`}>
        <img
            src="/ess-logo.png"
            alt="ESS Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="text-[#1d4e89] flex flex-col items-center justify-center font-black space-y-0 leading-none"><span class="text-[8px]">ESS</span><div class="w-6 h-6 border-2 border-[#b38a5d] rounded-full flex items-center justify-center"><div class="w-3 h-3 bg-[#1d4e89] rounded-full animate-pulse"></div></div><span class="text-[8px]">ኢ.ስ.አ</span></div>';
            }}
        />
    </div>
);

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-[#f3f6f9] font-sans text-slate-900">
            {/* Top Header */}
            <div className="bg-white py-3 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <Logo className="w-14 h-14 transition-transform group-hover:scale-105" />
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-gray-500 tracking-tight leading-none mb-1">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                            <span className="text-sm md:text-lg font-black text-[#1d4e89] leading-none uppercase">ETHIOPIAN STATISTICAL SERVICE</span>
                        </div>
                    </Link>

                    {/* Search and Controls */}
                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-4 pr-10 py-2 w-64 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1d4e89]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="px-3 py-2 bg-[#b38a5d] rounded-r-md text-white border border-[#b38a5d] hover:bg-[#a07a50] transition-colors">
                                    <Search size={18} />
                                </button>
                            </form>
                        </div>

                        <div className="flex items-center gap-3">
                            <a href="https://facebook.com/essethiopia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1d4e89] flex items-center justify-center text-white hover:bg-[#153a66] transition-colors">
                                <Facebook size={16} fill="currentColor" />
                            </a>
                            <a href="https://t.me/ess_statistics" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1d4e89] flex items-center justify-center text-white hover:bg-[#153a66] transition-colors">
                                <Send size={16} fill="currentColor" />
                            </a>
                        </div>

                        <div className="flex items-center gap-1 border-x border-gray-200 px-4 group cursor-pointer h-10 hover:bg-gray-50 transition-colors">
                            <Globe2 size={16} className="text-[#1d4e89]" />
                            <span className="text-sm font-bold text-gray-700 uppercase">EN</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform" />
                        </div>

                        <Link to="/login" className="bg-[#1d4e89] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-[#153a66] shadow-sm transition-all transform active:scale-95">
                            Stat Bank
                        </Link>
                    </div>
                </div>
            </div>

            {/* Blue Navigation Bar */}
            <nav className="bg-[#1d4e89] text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-center space-x-8 h-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <li className="hover:text-blue-200 cursor-pointer font-bold text-sm tracking-wide transition-colors">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="flex items-center gap-1 hover:text-blue-200 cursor-pointer font-bold text-sm tracking-wide transition-colors group">
                            About ESS <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </li>
                        <li className="flex items-center gap-1 hover:text-blue-200 cursor-pointer font-bold text-sm tracking-wide transition-colors group">
                            Find Statistics <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </li>
                        <li className="flex items-center gap-1 hover:text-blue-200 cursor-pointer font-bold text-sm tracking-wide transition-colors group">
                            News ESS <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </li>
                        <li className="flex items-center gap-1 hover:text-blue-200 cursor-pointer font-bold text-sm tracking-wide transition-colors relative h-12 group">
                            Media <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#b38a5d]"></div>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li><Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-600 font-semibold uppercase tracking-wider">Media</li>
                    </ol>
                </nav>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 pb-24">
                <h1 className="text-4xl font-black text-[#1d4e89] mb-12 flex items-center gap-4">
                    Media
                    <div className="h-1 w-20 bg-[#b38a5d] rounded-full"></div>
                </h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Activity Card: News */}
                    <Link to="/news" className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#1d4e89] group-hover:w-2 transition-all"></div>
                        <h2 className="text-2xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform">News</h2>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-colors duration-300">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Activity Card: Events */}
                    <Link to="/events" className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#1d4e89] group-hover:w-2 transition-all"></div>
                        <h2 className="text-2xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform">Events</h2>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-colors duration-300">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Activity Card: Photo Gallery */}
                    <Link to="/photo-gallery" className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#1d4e89] group-hover:w-2 transition-all"></div>
                        <h2 className="text-2xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform">Photo Gallery</h2>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-colors duration-300">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Activity Card: Video Gallery */}
                    <Link to="/video-gallery" className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#1d4e89] group-hover:w-2 transition-all"></div>
                        <h2 className="text-2xl font-black text-[#1d4e89] group-hover:translate-x-2 transition-transform">Video Gallery</h2>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#1d4e89] group-hover:text-white transition-colors duration-300">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#1d4e89] text-white pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        {/* Logo Section */}
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center space-x-3 group text-left">
                                <Logo className="w-16 h-16 transition-transform group-hover:rotate-12" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-tight leading-none mb-1">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                                    <span className="text-base font-black leading-none uppercase">ETHIOPIAN STATISTICAL SERVICE</span>
                                </div>
                            </Link>
                            <p className="text-blue-100 text-sm leading-relaxed max-w-xs opacity-80">
                                Your reliable data source since 1956. Managing regional and national statistics with transparency and excellence.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="text-left">
                            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#b38a5d] pb-1 inline-block uppercase tracking-wider">Quick links</h3>
                            <ul className="space-y-4 text-sm font-medium text-blue-100">
                                <li className="hover:text-white transition-colors cursor-pointer capitalize flex items-center gap-2">
                                    <ArrowRight size={14} className="text-[#b38a5d]" />
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="hover:text-white transition-colors cursor-pointer capitalize flex items-center gap-2">
                                    <ArrowRight size={14} className="text-[#b38a5d]" />
                                    <span>About ESS</span>
                                </li>
                                <li className="hover:text-white transition-colors cursor-pointer capitalize flex items-center gap-2">
                                    <ArrowRight size={14} className="text-[#b38a5d]" />
                                    <Link to="/login">Portal Access</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div className="text-left">
                            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#b38a5d] pb-1 inline-block uppercase tracking-wider">Contact Us</h3>
                            <div className="space-y-5 text-sm font-medium text-blue-100">
                                <div className="space-y-1">
                                    <p className="font-bold text-[#b38a5d] uppercase tracking-widest text-[10px]">HEADQUARTERS</p>
                                    <p className="text-white font-bold">Ethiopian Statistical Service (ESS)</p>
                                </div>
                                <div className="flex items-start gap-3 opacity-90">
                                    <MapPin size={18} className="text-[#b38a5d] shrink-0" />
                                    <p>Arada Sub City, Near Piassa, Addis Ababa, Ethiopia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em] opacity-60">
                        <p>© 2026 Ethiopian Statistical Service - All rights reserved</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Safety</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Policy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
