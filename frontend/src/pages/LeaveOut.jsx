import React, { useState, useEffect } from 'react';
import { LogOut, User, Phone, Briefcase, RotateCcw, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const LeaveOut = () => {
    const [leaveList, setLeaveList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaveList();
    }, []);

    const fetchLeaveList = async () => {
        try {
            const res = await api.get('/employees/leave-out');
            setLeaveList(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id) => {
        if (!window.confirm('Reactivate this employee?')) return;
        try {
            await api.post(`/employees/return-from-leave/${id}`);
            fetchLeaveList();
        } catch (err) {
            console.error(err);
            alert('Failed to reactivate employee');
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/employees/export-leave-out', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'leave_out_members.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Failed to export leave-out members: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-red-400 via-rose-400 to-pink-500 bg-clip-text text-transparent uppercase">Inactivity Archive</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Monitoring decommissioned units and personnel on extended departure.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-lg shadow-red-500/20"></div>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800/40 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-xl transition-all font-black uppercase tracking-widest text-[11px] backdrop-blur-sm active:scale-95"
                >
                    <FileSpreadsheet size={18} />
                    <span>Export Matrix</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                    <p className="text-red-500/50 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Archive Matrix...</p>
                </div>
            ) : (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] shadow-3xl border border-red-500/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-red-500/10">
                                    <th className="px-6 py-5 text-[10px] font-black text-red-500/60 uppercase tracking-[0.2em] whitespace-nowrap">Personnel Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-red-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Designation</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-red-400/60 uppercase tracking-[0.2em] text-center whitespace-nowrap font-mono">Comm-Link</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-red-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Departure Registry</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-red-400/60 uppercase tracking-[0.2em] text-right whitespace-nowrap">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {leaveList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-700 font-black uppercase tracking-widest italic">No personnel records detected in inactivity archive.</td>
                                    </tr>
                                ) : (
                                    leaveList.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-red-500/5 transition-all group/row">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-red-500/20 text-red-400 flex items-center justify-center font-black text-lg shadow-inner group-hover/row:scale-110 group-hover/row:border-red-500 transition-all duration-500 opacity-60">
                                                        {emp.name[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-400 uppercase tracking-tight text-sm leading-none mb-1 group-hover/row:text-slate-100 transition-colors">{emp.name} {emp.father_name}</span>
                                                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{emp.grand_father_name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs text-slate-500 font-black uppercase tracking-tight">{emp.position}</span>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] text-slate-600 font-mono font-bold tracking-tight text-center">{emp.phone_number}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                        {emp.LeaveOutMember ? new Date(emp.LeaveOutMember.leave_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) : 'N/A'}
                                                    </span>
                                                    <span className="text-[9px] text-red-500/40 font-bold uppercase tracking-[0.2em]">DE-ACTIVATED</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => handleReturn(emp.id)}
                                                    className="px-5 py-2.5 bg-slate-800/50 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto"
                                                >
                                                    <RotateCcw size={14} />
                                                    <span>Re-Initialize</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveOut;
