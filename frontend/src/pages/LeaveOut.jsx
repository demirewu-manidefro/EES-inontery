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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Leave Out Members</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage employees who have left or are on extended leave.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <FileSpreadsheet size={20} />
                    <span className="font-semibold">Export List</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Employee</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Position</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-center">Phone</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Date Left</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {leaveList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500 italic">No members currently in leave out status.</td>
                                </tr>
                            ) : (
                                leaveList.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm">
                                                    {emp.name[0]}
                                                </div>
                                                <span className="font-bold dark:text-white">{emp.name} {emp.father_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{emp.position}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 text-center">{emp.phone_number}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {emp.LeaveOutMember ? new Date(emp.LeaveOutMember.leave_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleReturn(emp.id)}
                                                className="px-3 py-1.5 text-xs font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-all flex items-center space-x-1.5 ml-auto"
                                            >
                                                <RotateCcw size={14} />
                                                <span>Reactivate</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveOut;
