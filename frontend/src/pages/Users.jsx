import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Save, User, Trash2, Edit2, Shield, Key } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setIsEditing(true);
        setSelectedUser(user);
        setFormData({
            username: user.username,
            password: '', // Password is not fetched/shown
            role: user.role
        });
        setShowModal(true);
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setSelectedUser(null);
        setFormData({
            username: '',
            password: '',
            role: 'admin'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // Don't send empty password if not changing
                await api.put(`/admin/user/${selectedUser.id}`, payload);
            } else {
                await api.post('/admin/user', formData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Terminate this access credential? This action is irreversible.')) return;
        try {
            await api.delete(`/admin/user/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent uppercase">Access Matrix</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Managing system authority and cryptographic identifiers.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full shadow-lg shadow-indigo-500/20"></div>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Initialize Credential</span>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-3xl p-4 rounded-2xl border border-indigo-500/10 shadow-2xl">
                <div className="relative flex-1 sm:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="SCAN ACCESS LOGS..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-indigo-500/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white placeholder-slate-700 text-[11px] font-black tracking-widest shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-4 px-4 border-l border-slate-800/50">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Links</span>
                        <span className="text-sm font-mono font-black text-indigo-400">{filteredUsers.length}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-indigo-500/50 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix...</p>
                </div>
            ) : (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] shadow-3xl border border-indigo-500/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-indigo-500/10">
                                    <th className="px-8 py-5 text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.2em] whitespace-nowrap">Subject Identifier</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Security Clearance</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] text-right whitespace-nowrap">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-500/5 transition-all group/row">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg shadow-inner group-hover/row:scale-110 group-hover/row:border-indigo-500 transition-all duration-500">
                                                    {user.username[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-100 uppercase tracking-tight text-sm leading-none mb-1">{user.username}</span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover/row:text-indigo-400/60 transition-colors">Credential Verified</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-500 ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover/row:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover/row:shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-3 opacity-40 group-hover/row:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 rounded-xl transition-all active:scale-95"
                                                    title="Modify Access Rights"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all active:scale-95"
                                                    title="De-Authorize Subject"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-md shadow-3xl border border-indigo-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
                                        <Shield size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{isEditing ? 'Sync Access' : 'New Link'}</h3>
                                        <p className="text-[10px] text-indigo-500/60 font-black uppercase tracking-widest mt-1">Registry Protocol 7.2</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Subject Alias</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            required
                                            type="text"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-indigo-500/10 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-slate-700 text-sm font-bold tracking-tight"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Enter identity alias..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                                        Cryptographic Key {isEditing && <span className="text-slate-600 lowercase font-normal italic">(bypass if unchanged)</span>}
                                    </label>
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-indigo-500/10 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-slate-700 text-sm font-bold tracking-tight"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={isEditing ? "••••••••" : "Define access key..."}
                                            required={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Clearance Tier</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-950/50 border border-indigo-500/10 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-bold tracking-tight appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="admin">LEVEL_0: ARCHITECT (ADMIN)</option>
                                        <option value="manager">LEVEL_1: OVERSEER (MANAGER)</option>
                                        <option value="user">LEVEL_2: OPERATOR (USER)</option>
                                    </select>
                                </div>

                                <div className="pt-6">
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-[13px] border border-indigo-400/30"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                <span>{isEditing ? 'Verify Changes' : 'Finalize Matrix'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;
