import React, { useState, useEffect } from 'react';
import { Clock, User, Phone, CheckCircle, XCircle, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const WaitingReturn = () => {
    const [waitingList, setWaitingList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWaitingList();
    }, []);

    const fetchWaitingList = async () => {
        try {
            const res = await api.get('/admin/waiting-list');
            setWaitingList(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this employee from the waiting list?')) return;
        try {
            await api.post(`/employees/waiting-remove/${id}`);
            fetchWaitingList();
        } catch (err) {
            console.error(err);
            alert('Failed to remove from waiting list');
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/admin/waiting-list/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'waiting_list.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Failed to export waiting list: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent uppercase">Return Queue</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Monitoring units scheduled for hardware de-allocation.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-500/20"></div>
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
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    <p className="text-amber-500/50 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Queue Data...</p>
                </div>
            ) : (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] shadow-3xl border border-amber-500/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-amber-500/10">
                                    <th className="px-6 py-5 text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em] whitespace-nowrap">Personnel Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Designation</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em] whitespace-nowrap font-mono">Comm-Link</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Queue Registry</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em] text-right whitespace-nowrap">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {waitingList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-700 font-black uppercase tracking-widest italic">No pending returns detected in current cycle.</td>
                                    </tr>
                                ) : (
                                    waitingList.map((item) => {
                                        const emp = item.Employee;
                                        if (!emp) return null;
                                        return (
                                            <tr key={item.id} className="hover:bg-amber-500/5 transition-all group/row">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg shadow-inner group-hover/row:scale-110 group-hover/row:border-amber-500 transition-all duration-500">
                                                            {emp.name[0]}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-100 uppercase tracking-tight text-sm leading-none mb-1">{emp.name} {emp.father_name}</span>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{emp.grand_father_name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs text-slate-300 font-black uppercase tracking-tight">{emp.position}</span>
                                                </td>
                                                <td className="px-6 py-5 text-[11px] text-slate-400 font-mono font-bold tracking-tight">{emp.phone_number}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</span>
                                                        <span className="text-[9px] text-amber-500/40 font-bold uppercase tracking-[0.2em]">REGISTERED</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => handleRemove(emp.id)}
                                                        className="w-10 h-10 inline-flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all active:scale-95"
                                                        title="Protocol: Revoke Queue Entry"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaitingReturn;
