import React, { useState } from 'react';
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
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
                {/* Futuristic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900"></div>

                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)'
                }}></div>

                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                <div className="text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 mb-6 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Registration Sent!</h1>
                    <p className="text-slate-400 mt-4 max-w-md mx-auto">Your account is pending approval. You will be notified once an administrator approves your access.</p>
                    <p className="text-cyan-400 font-medium mt-8 flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                        <span>Redirecting to login...</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
            {/* Futuristic Background - CSS Fallback */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950"></div>

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            }}></div>

            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Diagonal Lines Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(6, 182, 212, 0.3) 10px, rgba(6, 182, 212, 0.3) 11px)',
                }}></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 mb-6 backdrop-blur-xl">
                        <UserPlus size={40} className="text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Create Account</h1>
                    <p className="text-slate-400">Join EMS Pro to manage your team effectively</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-cyan-500/20">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center space-x-3 text-red-400 backdrop-blur-sm">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-cyan-300 mb-2">Username</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-500 backdrop-blur-sm"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-500 backdrop-blur-sm"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cyan-300 mb-2">Role</label>
                            <div className="relative group">
                                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors z-10" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white appearance-none backdrop-blur-sm"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin" className="bg-slate-800">Administrator Staff</option>
                                    <option value="manager" className="bg-slate-800">Section Manager</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-2xl shadow-cyan-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border border-cyan-500/30"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </span>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-400">
                        Already have an account? <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Sign in</Link>
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Register;
