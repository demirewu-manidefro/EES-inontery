import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Search, Filter, Phone, Briefcase, MapPin, X, Check, Save, Clock, UserCheck, UserMinus, User, UserPlus, Package, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [newEmp, setNewEmp] = useState({
        name: '',
        father_name: '',
        grand_father_name: '',
        sex: 'M',
        position: '',
        employment_status: 'Permanent',
        phone_number: '',
        project: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/employees', newEmp);
            setShowAddModal(false);
            setNewEmp({
                name: '',
                father_name: '',
                grand_father_name: '',
                sex: 'M',
                position: '',
                employment_status: 'Permanent',
                phone_number: '',
                project: ''
            });
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add employee');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const res = await api.post('/employees/bulk-upload', formData);
            alert(res.data.message);
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/employees/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employees_list.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            if (err.response?.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        alert('Failed to export data: ' + (errorData.message || 'Unknown error'));
                    } catch (e) {
                        alert('Failed to export data: ' + err.message);
                    }
                };
                reader.readAsText(err.response.data);
            } else {
                alert('Failed to export data: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const addToWaiting = async (empId) => {
        try {
            await api.post(`/employees/waiting/${empId}`);
            alert('Added to waiting list');
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add to waiting list');
        }
    };

    const approveLeave = async (empId) => {
        if (!window.confirm('Are you sure you want to add this employee to the Leave Out list? This will mark them as inactive.')) return;
        try {
            await api.post(`/employees/approve-leave/${empId}`);
            alert('Added to Leave Out list');
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve leave (Ensure all materials are returned)');
        }
    };

    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'borrowed'

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = `${emp.name} ${emp.father_name} ${emp.grand_father_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.phone_number.includes(searchTerm);

        if (activeTab === 'borrowed') {
            return matchesSearch && emp.BorrowedMaterials?.length > 0;
        }
        return matchesSearch;
    });

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Personnel Matrix</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Tracking national human capital and resource allocation.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all shadow-xl shadow-cyan-500/20 font-black uppercase tracking-widest text-[11px] border border-cyan-400/30 active:scale-95"
                    >
                        <UserPlus size={18} />
                        <span>Add Unit</span>
                    </button>
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleBulkUpload}
                        accept=".xlsx,.csv"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900/50 hover:bg-slate-800/80 border border-cyan-500/20 text-cyan-400 rounded-xl transition-all font-black uppercase tracking-widest text-[11px] backdrop-blur-sm"
                    >
                        <Upload size={18} />
                        <span>Sync File</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800/40 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-xl transition-all font-black uppercase tracking-widest text-[11px] backdrop-blur-sm"
                    >
                        <FileSpreadsheet size={18} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-3xl p-4 rounded-2xl border border-cyan-500/10 shadow-2xl">
                <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide shrink-0">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-slate-500 hover:text-cyan-400 hover:bg-slate-800/50'}`}
                    >
                        All Units
                    </button>
                    <button
                        onClick={() => setActiveTab('borrowed')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'borrowed' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800/50'}`}
                    >
                        With Gear
                    </button>
                </div>

                <div className="relative flex-1 sm:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="SCAN PERSONNEL RECORDS..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-cyan-500/10 rounded-xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-700 text-[11px] font-black tracking-widest shadow-inner overflow-hidden"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-cyan-500/50 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Database Matrix...</p>
                </div>
            ) : (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] shadow-3xl border border-cyan-500/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-cyan-500/10">
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.2em] whitespace-nowrap">Personnel Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] text-center whitespace-nowrap">Sex</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Designation</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap font-mono">Comm-Link</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Sector</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Registry</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Hardware</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] text-right whitespace-nowrap">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-20 text-center text-slate-700 font-black uppercase tracking-widest italic">No matching records found in database.</td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-cyan-500/5 transition-all group/row">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg shadow-inner group-hover/row:scale-110 group-hover/row:border-cyan-500 transition-all duration-500">
                                                        {emp.name[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-100 uppercase tracking-tight text-sm leading-none mb-1">{emp.name} {emp.father_name}</span>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{emp.grand_father_name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${emp.sex === 'M' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'}`}>
                                                    {emp.sex === 'M' ? 'Male' : 'Female'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-300 font-black uppercase tracking-tight mb-1">{emp.position}</span>
                                                    <span className="text-[9px] text-cyan-500/50 font-bold uppercase tracking-widest">{emp.employment_status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] text-slate-400 font-mono font-bold tracking-tight">{emp.phone_number}</td>
                                            <td className="px-6 py-5 text-[10px] text-slate-400 font-black uppercase tracking-widest">{emp.project}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`text-xs font-bold ${emp.BorrowedMaterials?.length > 0 ? 'text-amber-400' : 'text-slate-700'}`}>
                                                    {emp.BorrowedMaterials?.length > 0 ? (
                                                        <div className="flex flex-col gap-2">
                                                            {emp.BorrowedMaterials.map((bm, idx) => (
                                                                <span key={idx} className="flex items-center gap-2 text-[10px] uppercase tracking-info font-black">
                                                                    <Package size={12} className="text-amber-500" />
                                                                    {bm.Material?.name || 'GENERIC_UNIT'}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="flex items-center gap-2 opacity-50">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div> EMPTY
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => addToWaiting(emp.id)}
                                                        className="w-9 h-9 flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-lg hover:shadow-amber-500/20"
                                                        title="Protocol: Queue for Return"
                                                    >
                                                        <Clock size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => approveLeave(emp.id)}
                                                        className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                                                        title="Protocol: Deactivate Unit"
                                                    >
                                                        <UserMinus size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Employee Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-2xl shadow-3xl border border-cyan-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
                                        <UserPlus size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Initialize Unit</h3>
                                        <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest mt-1 italic">Registry Core v2.04</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { label: 'Primary Name', field: 'name', type: 'text' },
                                    { label: 'Patronymic', field: 'father_name', type: 'text' },
                                    { label: 'Ancestral', field: 'grand_father_name', type: 'text' },
                                    { label: 'Biological Sex', field: 'sex', type: 'select', options: [{ v: 'M', l: 'MALE' }, { v: 'F', l: 'FEMALE' }] },
                                    { label: 'Role / Designation', field: 'position', type: 'text' },
                                    { label: 'Contract Matrix', field: 'employment_status', type: 'select', options: [{ v: 'Permanent', l: 'PERMANENT' }, { v: 'Contract', l: 'CONTRACT' }] },
                                    { label: 'Comm Link ID', field: 'phone_number', type: 'tel' },
                                    { label: 'Assigned Project', field: 'project', type: 'text' }
                                ].map((input) => (
                                    <div key={input.field} className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">{input.label}</label>
                                        {input.type === 'select' ? (
                                            <select
                                                className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner appearance-none relative"
                                                value={newEmp[input.field]}
                                                onChange={(e) => setNewEmp({ ...newEmp, [input.field]: e.target.value })}
                                            >
                                                {input.options.map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                required
                                                type={input.type}
                                                className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner placeholder-slate-800"
                                                value={newEmp[input.field]}
                                                onChange={(e) => setNewEmp({ ...newEmp, [input.field]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                ))}

                                <div className="md:col-span-2 pt-10">
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-[1.5rem] font-black shadow-2xl shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-[13px] border border-cyan-400/30"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                <span>Finalize Registration</span>
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

export default Employees;
