import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Users,
    Package,
    Home,
    LogOut,
    Menu,
    X,
    ClipboardCheck,
    Clock,
    UserPlus,
    FileUp,
    Settings,
    RotateCcw,
    Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Console', icon: Home, path: '/dashboard' },
        { name: 'Personnel', icon: Users, path: '/employees' },
        { name: 'Hardware', icon: Package, path: '/materials' },
        { name: 'Issuance', icon: ClipboardCheck, path: '/borrow' },
        { name: 'Recovery', icon: RotateCcw, path: '/return' },
        { name: 'Queue', icon: Clock, path: '/waiting' },
        { name: 'Archives', icon: LogOut, path: '/leave-out' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Requests', icon: UserPlus, path: '/admin-approvals' });
        navItems.push({ name: 'Security', icon: Shield, path: '/users' });
    }

    return (
        <div className="min-h-screen flex bg-slate-950 relative selection:bg-cyan-500 selection:text-white">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
                <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2"></div>
            </div>

            <aside
                className={`fixed top-0 left-0 h-screen w-72 bg-slate-900/60 backdrop-blur-3xl shadow-[5px_0_30px_rgba(0,0,0,0.5)] border-r border-cyan-500/10 z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="p-8 flex items-center justify-between relative">
                        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform">
                                <Shield size={20} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">Matrix<span className="text-cyan-500">_</span>Sys</h1>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto scrollbar-hide">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 ml-2">Navigation Matrix</p>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-2xl shadow-cyan-500/5'
                                        : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`
                                }
                            >
                                <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="p-6 mt-auto bg-slate-950/50 border-t border-cyan-500/10 backdrop-blur-md">
                        <div className="flex items-center space-x-4 mb-6 p-4 bg-slate-900 shadow-inner rounded-3xl border border-slate-800">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg shadow-xl shadow-cyan-500/10">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white uppercase tracking-tight truncate leading-none mb-1">{user?.username}</p>
                                <span className="text-[9px] text-cyan-500/60 font-black uppercase tracking-widest">{user?.role} clearance</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-3 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-red-500/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all active:scale-95"
                        >
                            <LogOut size={18} />
                            <span>Terminate Link</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col md:ml-72 relative min-h-screen">
                <header className="h-20 flex items-center justify-between px-8 bg-slate-900/40 backdrop-blur-2xl border-b border-cyan-500/10 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-3 rounded-2xl bg-slate-800/50 text-cyan-400 border border-cyan-500/10"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-6 ml-auto">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">System Status</span>
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">All Cores Active</span>
                            </div>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-800"></div>
                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer group">
                            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 sm:p-10 container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </main>

                <footer className="p-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">© 2026 Matrix Command Systems. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest cursor-wait hover:text-cyan-500 transition-colors uppercase tracking-[0.3em]">Privacy protocols</span>
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest cursor-wait hover:text-cyan-500 transition-colors uppercase tracking-[0.3em]">Security policy</span>
                    </div>
                </footer>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
