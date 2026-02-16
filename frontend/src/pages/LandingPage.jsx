import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Facebook,
    Send,
    ArrowRight,
    ChevronDown,
    Globe,
    Phone,
    Mail,
    MapPin,
    Newspaper,
    Calendar,
    Image as ImageIcon,
    Video
} from 'lucide-react';

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-[#f3f6f9] font-sans text-slate-900">
            {/* Top Header */}
            <div className="bg-white py-3 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <div className="w-14 h-14">
                            <img
                                src="https://ess.gov.et/wp-content/uploads/2023/11/ess-logo-v3.png"
                                alt="ESS Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-gray-500 tracking-tight leading-none mb-1">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                            <span className="text-sm md:text-lg font-black text-[#1d4e89] leading-none uppercase">ETHIOPIAN STATISTICAL SERVICE</span>
                        </div>
                    </div>

                    {/* Search and Controls */}
                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-4 pr-10 py-2 w-64 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1d4e89]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="px-3 py-2 bg-[#b38a5d] rounded-r-md text-white border border-[#b38a5d]">
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1d4e89] flex items-center justify-center text-white hover:bg-opacity-90">
                                <Facebook size={16} fill="currentColor" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1d4e89] flex items-center justify-center text-white hover:bg-opacity-90">
                                <Send size={16} fill="currentColor" />
                            </a>
                        </div>

                        <div className="flex items-center gap-1 border-x border-gray-200 px-4 group cursor-pointer h-10">
                            <img src="https://flagpedia.net/data/flags/mini/gb.png" alt="UK Flag" className="w-5 h-3 object-cover" />
                            <span className="text-sm font-bold text-gray-700 uppercase">EN</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>

                        <Link to="/login" className="bg-[#1d4e89] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-[#153a66] transition-all">
                            Stat Bank
                        </Link>
                    </div>
                </div>
            </div>

            {/* Blue Navigation Bar */}
            <nav className="bg-[#1d4e89] text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-center space-x-8 h-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <li className="hover:text-gray-200 cursor-pointer font-bold text-sm tracking-wide transition-colors">Home</li>
                        <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer font-bold text-sm tracking-wide transition-colors">
                            About ESS <ChevronDown size={14} />
                        </li>
                        <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer font-bold text-sm tracking-wide transition-colors">
                            Find Statistics <ChevronDown size={14} />
                        </li>
                        <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer font-bold text-sm tracking-wide transition-colors">
                            News ESS <ChevronDown size={14} />
                        </li>
                        <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer font-bold text-sm tracking-wide transition-colors relative h-12">
                            Media <ChevronDown size={14} />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#b38a5d]"></div>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-sm text-gray-400 font-medium">
                    Home / <span className="text-gray-600">Media</span>
                </p>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 pb-24">
                <h1 className="text-4xl font-black text-[#1d4e89] mb-12">Media</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Activity Card: News */}
                    <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#1d4e89]">News</h2>
                        <ArrowRight className="text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-300" size={28} />
                    </div>

                    {/* Activity Card: Events */}
                    <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#1d4e89]">Events</h2>
                        <ArrowRight className="text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-300" size={28} />
                    </div>

                    {/* Activity Card: Photo Gallery */}
                    <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#1d4e89]">Photo Gallery</h2>
                        <ArrowRight className="text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-300" size={28} />
                    </div>

                    {/* Activity Card: Video Gallery */}
                    <div className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#1d4e89]">Video Gallery</h2>
                        <ArrowRight className="text-[#1d4e89] group-hover:translate-x-2 transition-transform duration-300" size={28} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#1d4e89] text-white pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        {/* Logo Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 bg-white rounded-full p-1 shadow-lg">
                                    <img
                                        src="https://ess.gov.et/wp-content/uploads/2023/11/ess-logo-v3.png"
                                        alt="ESS Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-tight leading-none mb-1">የኢትዮጵያ ስታቲስቲክስ አገልግሎት</span>
                                    <span className="text-base font-black leading-none uppercase">ETHIOPIAN STATISTICAL SERVICE</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#b38a5d] pb-1 inline-block">Quick links</h3>
                            <ul className="space-y-4 text-sm font-medium text-blue-100">
                                <li className="hover:text-white transition-colors cursor-pointer capitalize">Home</li>
                                <li className="hover:text-white transition-colors cursor-pointer capitalize">About ESS</li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#b38a5d] pb-1 inline-block">Contact Us</h3>
                            <div className="space-y-4 text-sm font-medium text-blue-100">
                                <p className="font-bold text-white uppercase tracking-widest text-xs mb-2">HEADQUARTERS</p>
                                <p>Ethiopian Statistical Service (ESS)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
