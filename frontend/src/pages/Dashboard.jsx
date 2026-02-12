import React, { useState, useEffect } from 'react';
import { Users, Package, ClipboardCheck, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4"
    >
        <div className={`p-4 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold dark:text-white">{value}</p>
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={handleExportAll}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 font-bold"
                >
                    <FileSpreadsheet size={20} />
                    <span>Download Full Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} color="bg-blue-500" />
                <StatCard title="Available Materials" value={stats.totalMaterials} icon={Package} color="bg-emerald-500" />
                <StatCard title="Active Borrowings" value={stats.borrowedCount} icon={ClipboardCheck} color="bg-amber-500" />
                <StatCard title="Waiting Returns" value={stats.waitingCount} icon={Clock} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/employees')}
                            className="p-4 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                        >
                            <Users className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Add Employee</span>
                        </button>
                        <button
                            onClick={() => navigate('/materials')}
                            className="p-4 flex flex-col items-center justify-center space-y-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                        >
                            <Package className="text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Add Material</span>
                        </button>
                        <button
                            onClick={() => navigate('/borrow')}
                            className="p-4 flex flex-col items-center justify-center space-y-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
                        >
                            <ClipboardCheck className="text-amber-600" />
                            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">New Borrow</span>
                        </button>
                        <button
                            onClick={() => navigate('/return')}
                            className="p-4 flex flex-col items-center justify-center space-y-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <CheckCircle className="text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Return</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 italic">Feature coming soon: Live activity feed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
