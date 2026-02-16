import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X, Shield, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminApprovals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get('/admin/pending-users');
            setPendingUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/admin/approve-user/${id}`);
            fetchPendingUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/admin/reject-user/${id}`);
            fetchPendingUsers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Access Requests</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Reviewing external connection attempts to the secure matrix.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-cyan-500/50 font-black uppercase tracking-[0.2em] text-[10px]">Filtering Signals...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {pendingUsers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-32 bg-slate-900/20 border-2 border-dashed border-cyan-500/10 rounded-[2.5rem] text-center flex flex-col items-center justify-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-slate-950 border border-cyan-500/10 rounded-3xl flex items-center justify-center text-slate-800 shadow-inner">
                                    <Shield size={40} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No Pending Authorizations</p>
                                    <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tight text-center max-w-xs mx-auto">All external access requests have been cleared or terminated in the current cycle.</p>
                                </div>
                            </motion.div>
                        ) : (
                            pendingUsers.map((user) => (
                                <motion.div
                                    key={user.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-cyan-500/10 shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -z-10 group-hover:bg-cyan-500/10 transition-colors"></div>

                                    <div className="flex items-center space-x-5 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xl shadow-inner group-hover:border-cyan-500 transition-all duration-500">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-100 uppercase tracking-tight text-lg mb-1">{user.username}</h3>
                                            <span className="text-[9px] px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 uppercase font-black tracking-[0.2em]">{user.role}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-2xl shadow-emerald-500/20 active:scale-95 border border-emerald-400/20"
                                        >
                                            <Check size={16} />
                                            <span>Authorize</span>
                                        </button>
                                        <button
                                            onClick={() => handleReject(user.id)}
                                            className="px-5 py-4 bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/20 text-slate-500 hover:text-red-500 rounded-2xl transition-all active:scale-95"
                                            title="Terminate Request"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Access Level</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Standard Sub-Grid</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-cyan-500/20 animate-pulse"></div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminApprovals;
