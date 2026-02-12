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
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">EMS Pro</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3 mb-4 px-2">
                            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate dark:text-white">{user?.username}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative">
                            <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>
                            {/* Notifications or similar */}
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
