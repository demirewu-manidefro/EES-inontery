import React, { useState, useEffect } from 'react';
import { Users, Package, ClipboardCheck, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-cyan-500/20 flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 transition-all"
    >
        <div className={`p-3 sm:p-4 rounded-xl ${color} flex-shrink-0`}>
            <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-cyan-300 truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalMaterials: 0,
        borrowedCount: 0,
        waitingCount: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats({
                    totalEmployees: response.data.totalEmployees,
                    totalMaterials: response.data.totalMaterials,
                    borrowedCount: response.data.borrowedCount,
                    waitingCount: response.data.waitingCount,
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                // Fallback to fetch individual counts if /admin/stats fails for some reason
                try {
                    const [emps, mats] = await Promise.all([
                        api.get('/employees'),
                        api.get('/materials')
                    ]);
                    let borrowed = 0;
                    emps.data.forEach(e => {
                        if (e.BorrowedMaterials && e.BorrowedMaterials.length > 0) borrowed++;
                    });
                    setStats({
                        totalEmployees: emps.data.length,
                        totalMaterials: mats.data.length,
                        borrowedCount: borrowed,
                        waitingCount: 0,
                    });
                } catch (innerErr) {
                    console.error('Fallback fetch also failed:', innerErr);
                }
            }
        };
        fetchStats();
    }, []);

    const handleExportAll = async () => {
        try {
            const response = await api.get('/borrow/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'combined_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            if (err.response?.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        alert('Failed to export report: ' + (errorData.message || 'Unknown error'));
                    } catch (e) {
                        alert('Failed to export report: ' + err.message);
                    }
                };
                reader.readAsText(err.response.data);
            } else {
                alert('Failed to export report: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Dashboard Overview</h2>
                    <p className="text-sm sm:text-base text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={handleExportAll}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 font-bold btn-touch"
                >
                    <FileSpreadsheet size={18} />
                    <span className="text-sm sm:text-base">Download Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={Users}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    onClick={() => navigate('/employees')}
                />
                <StatCard
                    title="Available Materials"
                    value={stats.totalMaterials}
                    icon={Package}
                    color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    onClick={() => navigate('/materials')}
                />
                <StatCard
                    title="Active Borrowings"
                    value={stats.borrowedCount}
                    icon={ClipboardCheck}
                    color="bg-gradient-to-br from-amber-500 to-amber-600"
                    onClick={() => navigate('/borrow')}
                />
                <StatCard
                    title="Waiting Returns"
                    value={stats.waitingCount}
                    icon={Clock}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    onClick={() => navigate('/return')} // Or /waiting if that's more appropriate, but waiting returns usually implies returning. Actually /return page handles returns.
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-xl border border-cyan-500/20">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-cyan-300">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate('/employees')}
                            className="p-3 sm:p-4 flex flex-col items-center justify-center space-y-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all btn-touch"
                        >
                            <Users className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-xs sm:text-sm font-medium text-blue-400">Add Employee</span>
                        </button>
                        <button
                            onClick={() => navigate('/materials')}
                            className="p-3 sm:p-4 flex flex-col items-center justify-center space-y-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all btn-touch"
                        >
                            <Package className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-xs sm:text-sm font-medium text-emerald-400">Add Material</span>
                        </button>
                        <button
                            onClick={() => navigate('/borrow')}
                            className="p-3 sm:p-4 flex flex-col items-center justify-center space-y-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-all btn-touch"
                        >
                            <ClipboardCheck className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-xs sm:text-sm font-medium text-amber-400">New Borrow</span>
                        </button>
                        <button
                            onClick={() => navigate('/return')}
                            className="p-3 sm:p-4 flex flex-col items-center justify-center space-y-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/20 rounded-xl transition-all btn-touch"
                        >
                            <CheckCircle className="text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-xs sm:text-sm font-medium text-slate-300">Quick Return</span>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-xl border border-cyan-500/20">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-cyan-300">Recent Activity</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400 italic">Feature coming soon: Live activity feed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
