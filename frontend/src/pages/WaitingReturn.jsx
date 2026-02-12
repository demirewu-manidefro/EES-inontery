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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Waiting for Return</h2>
                    <p className="text-slate-500 dark:text-slate-400">Employees who are scheduled to return materials.</p>
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
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Phone Number</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Date Added</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {waitingList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500 italic">No employees currently in the waiting list.</td>
                                </tr>
                            ) : (
                                waitingList.map((item) => {
                                    const emp = item.Employee;
                                    if (!emp) return null;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900/10 text-purple-600 flex items-center justify-center font-bold text-sm">
                                                        {emp.name[0]}
                                                    </div>
                                                    <span className="font-bold dark:text-white">{emp.name} {emp.father_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400 capitalize">
                                                {emp.position}
                                            </td>
                                            <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                                                {emp.phone_number}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleRemove(emp.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                                                    title="Remove from Waiting List"
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
            )}
        </div>
    );
};

export default WaitingReturn;
