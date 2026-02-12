import React, { useState } from 'react';
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
    RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Employees', icon: Users, path: '/employees' },
        { name: 'Inventory', icon: Package, path: '/materials' },
        { name: 'Borrow', icon: ClipboardCheck, path: '/borrow' },
        { name: 'Return', icon: RotateCcw, path: '/return' },
        { name: 'Waiting List', icon: Clock, path: '/waiting' },
        { name: 'Leave Out', icon: LogOut, path: '/leave-out' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin Approvals', icon: UserPlus, path: '/admin-approvals' });
    }

    return (
        <div className="min-h-screen flex bg-slate-950 relative">
            {/* Background Image - Full Screen with Overlay */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/assets/background.png)',
                }}
            >
                <div className="absolute inset-0 bg-slate-950/40"></div>
            </div>

            {/* Sidebar - Fixed on Left */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-cyan-500/20 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between border-b border-cyan-500/20">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">EMS Pro</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-cyan-400">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-cyan-300 hover:border hover:border-cyan-500/20'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto border-t border-cyan-500/20">
                        <div className="flex items-center space-x-3 mb-4 px-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate text-cyan-100">{user?.username}</p>
                                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 p-2 rounded-lg text-red-400 hover:bg-red-900/20 hover:border hover:border-red-500/30 transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content - Offset by Sidebar Width */}
            <div className="flex-1 flex flex-col md:ml-64 relative z-10">
                <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-cyan-500/20">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 text-cyan-400"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="p-2 rounded-full hover:bg-slate-800/50 relative text-cyan-400">
                            <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
