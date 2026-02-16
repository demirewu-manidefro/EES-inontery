import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            setError(err.response?.data?.message || 'Initialization Failed: Registry access denied.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.2)_0%,rgba(2,6,23,1)_100%)]"></div>
                <div className="text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-10 shadow-3xl shadow-emerald-500/20 backdrop-blur-3xl"
                    >
                        <CheckCircle2 size={64} className="drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                    </motion.div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase tracking-tighter mb-4">Request Transmitted</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">Waiting for Matrix Authorization</p>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-1/2 h-full bg-emerald-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            ></motion.div>
                        </div>
                        <p className="text-emerald-400/60 font-black uppercase text-[9px] tracking-[0.4em] animate-pulse">Redirecting to Login Sequence</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]"></div>

            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="w-full max-w-md relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-slate-900/50 border border-cyan-500/20 shadow-3xl shadow-cyan-500/10 mb-8 backdrop-blur-2xl relative group">
                        <UserPlus size={44} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent mb-3 tracking-tighter uppercase">New Interface</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Initialization Terminal</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] shadow-4xl border border-cyan-500/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

                    {error && (
                        <div className="mb-8 p-5 bg-red-950/30 border border-red-500/20 rounded-2xl flex items-center space-x-4 text-red-400 shadow-xl text-center justify-center">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Identity Identifier</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-cyan-500/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-800 text-sm font-bold shadow-inner"
                                    placeholder="DEFINE ALIAS..."
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Cryptographic Key</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-cyan-500/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-800 text-sm font-bold shadow-inner"
                                    placeholder="SECURE CODE..."
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Clearance Designation</label>
                            <div className="relative group">
                                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors z-10" />
                                <select
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-cyan-500/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white appearance-none cursor-pointer text-sm font-bold shadow-inner"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin">System Architect Staff</option>
                                    <option value="manager">Sectional Overseer</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-500 text-white rounded-[1.8rem] font-black shadow-3xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 border border-indigo-400/30 uppercase tracking-[0.3em] text-[13px] relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            {loading ? (
                                <span className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                                    <span className="animate-pulse">Processing...</span>
                                </span>
                            ) : (
                                'Initiate Registry'
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-800/50 text-center">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            Existing identity discovered? <br />
                            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors ml-1 mt-2 inline-block">Return to Uplink</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
