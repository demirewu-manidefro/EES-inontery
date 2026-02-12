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
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-2xl">
                    <Shield size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Access Requests</h2>
                    <p className="text-slate-500 dark:text-slate-400">Review and approve new user account registrations.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {pendingUsers.length === 0 ? (
                            <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
                                <Check size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-500 font-medium">No pending approval requests.</p>
                            </div>
                        ) : (
                            pendingUsers.map((user) => (
                                <motion.div
                                    key={user.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary-600">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold dark:text-white">{user.username}</h3>
                                            <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 uppercase font-bold tracking-wider">{user.role}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
                                        >
                                            <Check size={18} />
                                            <span>Approve</span>
                                        </button>
                                        <button
                                            onClick={() => handleReject(user.id)}
                                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <X size={18} />
                                        </button>
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
