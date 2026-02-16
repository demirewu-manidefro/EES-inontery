import React, { useState, useEffect } from 'react';
import { Users, Package, ClipboardCheck, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, gradient, shadowColor, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-cyan-500/10 flex items-center space-x-5 cursor-pointer shadow-2xl relative overflow-hidden group"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadowColor} flex-shrink-0 group-hover:rotate-6 transition-transform duration-500`}>
            <Icon size={24} className="drop-shadow-md" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 group-hover:text-cyan-400 transition-colors">{title}</p>
            <p className="text-3xl font-black text-white tracking-tighter leading-none">{value}</p>
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
        }
    };

    return (
        <div className="space-y-10 sm:space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Command Console</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Real-time telemetry and resource allocation metrics.</p>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
                </div>
                <button
                    onClick={handleExportAll}
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-slate-800/40 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] backdrop-blur-sm shadow-2xl active:scale-95 group"
                >
                    <FileSpreadsheet size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>Download Master Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <StatCard
                    title="Active Units"
                    value={stats.totalEmployees}
                    icon={Users}
                    gradient="from-blue-600 to-indigo-600"
                    shadowColor="shadow-blue-500/30"
                    onClick={() => navigate('/employees')}
                />
                <StatCard
                    title="Hardware Inventory"
                    value={stats.totalMaterials}
                    icon={Package}
                    gradient="from-emerald-500 to-teal-600"
                    shadowColor="shadow-emerald-500/30"
                    onClick={() => navigate('/materials')}
                />
                <StatCard
                    title="Deployed Assets"
                    value={stats.borrowedCount}
                    icon={ClipboardCheck}
                    gradient="from-amber-500 to-orange-600"
                    shadowColor="shadow-amber-500/30"
                    onClick={() => navigate('/borrow')}
                />
                <StatCard
                    title="Recovery Queue"
                    value={stats.waitingCount}
                    icon={Clock}
                    gradient="from-purple-500 to-pink-600"
                    shadowColor="shadow-purple-500/30"
                    onClick={() => navigate('/return')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12">
                    <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-3xl border border-cyan-500/10 relative overflow-hidden group/actions">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                        <h3 className="text-[10px] font-black mb-8 text-cyan-500/60 uppercase tracking-[0.4em]">Rapid Deployment Sub-Modules</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {[
                                { label: 'Personnel Registry', icon: Users, color: 'blue', path: '/employees', desc: 'Add new unit' },
                                { label: 'Hardware Registry', icon: Package, color: 'emerald', path: '/materials', desc: 'Register asset' },
                                { label: 'Asset Issuance', icon: ClipboardCheck, color: 'amber', path: '/borrow', desc: 'Initiate link' },
                                { label: 'Resource recovery', icon: CheckCircle, color: 'indigo', path: '/return', desc: 'Sync return' }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    className={`p-6 flex flex-col items-center justify-center space-y-4 bg-slate-950/40 hover:bg-${action.color}-500/10 border border-slate-800/50 hover:border-${action.color}-500/30 rounded-[2rem] transition-all duration-500 group/btn active:scale-95 shadow-lg`}
                                >
                                    <div className={`p-4 rounded-2xl bg-${action.color}-500/10 text-${action.color}-400 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-500`}>
                                        <action.icon size={28} />
                                    </div>
                                    <div className="text-center">
                                        <span className={`text-[10px] font-black uppercase text-slate-100 tracking-widest block group-hover/btn:text-${action.color}-400 transition-colors`}>{action.label}</span>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1 block italic">{action.desc}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-12">
                    <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-3xl border border-cyan-500/10 relative overflow-hidden h-full">
                        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"></div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.4em]">Telemetry Feed</h3>
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                <span className="text-[9px] font-black text-cyan-500/60 uppercase tracking-widest leading-none mt-0.5">Live Uplink</span>
                            </div>
                        </div>
                        <div className="space-y-6 py-10 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-[2rem]">
                            <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-ping"></div>
                                <Clock size={32} className="text-slate-800" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Queue Synchronizing</p>
                                <p className="text-[10px] text-slate-700 font-bold uppercase leading-relaxed max-w-[200px]">Temporal event stream mapping will be accessible in revision 5.0.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
