import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied: Invalid cryptographic signature.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]"></div>

            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <div className="w-full max-w-md relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-slate-900/50 border border-cyan-500/20 shadow-3xl shadow-cyan-500/10 mb-8 backdrop-blur-2xl relative group">
                        <div className="absolute inset-0 rounded-[2rem] bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
                        <LogIn size={44} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent mb-3 tracking-tighter uppercase">Terminal Access</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Protocol v9.42</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] shadow-4xl border border-cyan-500/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

                    {error && (
                        <div className="mb-8 p-5 bg-red-950/30 border border-red-500/20 rounded-2xl flex items-center space-x-4 text-red-400 shadow-xl">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Identity Alias</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-cyan-500/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-800 text-sm font-bold shadow-inner"
                                    placeholder="SCANNING..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Security Key</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-cyan-500/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-800 text-sm font-bold shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white rounded-[1.8rem] font-black shadow-3xl shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 border border-cyan-400/30 uppercase tracking-[0.3em] text-[13px] relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            {loading ? (
                                <span className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                                    <span className="animate-pulse">Authorizing...</span>
                                </span>
                            ) : (
                                'Initiate Uplink'
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-800/50 text-center">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-loose">
                            Unauthorized access is strictly prohibited. <br />
                            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors ml-1">Encrypted Registration</Link>
                        </p>
                    </div>
                </motion.div>

                <div className="mt-12 flex justify-center space-x-8">
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1">Status</span>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Normal Ops</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1">Uplink</span>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span className="text-[9px] text-cyan-500 font-black uppercase tracking-widest">Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
