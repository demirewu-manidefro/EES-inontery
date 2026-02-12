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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Employee Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Total workforce overview and material allocation.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                    >
                        <Plus size={20} />
                        <span className="font-semibold">Add Employee</span>
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
                        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    >
                        <Upload size={20} />
                        <span className="font-semibold">Bulk Upload</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <FileSpreadsheet size={20} />
                        <span className="font-semibold">Export</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        All Employees
                    </button>
                    <button
                        onClick={() => setActiveTab('borrowed')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'borrowed' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Borrowed Only
                    </button>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by full name or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Full Name</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-center">Sex</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Position</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Phone</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Project</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Borrowed</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-slate-500 italic">No employees found matching your search.</td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/10 text-primary-600 flex items-center justify-center font-bold text-sm">
                                                    {emp.name[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold dark:text-white">{emp.name} {emp.father_name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase">{emp.grand_father_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.sex === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                {emp.sex}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm dark:text-slate-300 font-medium">{emp.position}</span>
                                                <span className="text-[10px] text-slate-400">{emp.employment_status}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm dark:text-slate-400 font-mono">{emp.phone_number}</td>
                                        <td className="p-4 text-sm dark:text-slate-400">{emp.project}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-1.5">
                                                <span className={`font-bold text-sm ${emp.BorrowedMaterials?.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                                                    {emp.BorrowedMaterials?.length || 0}
                                                </span>
                                                <Package size={14} className={emp.BorrowedMaterials?.length > 0 ? 'text-amber-500' : 'text-slate-300'} />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => addToWaiting(emp.id)}
                                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-all"
                                                    title="Add to Waiting List"
                                                >
                                                    <Clock size={16} />
                                                </button>
                                                <button
                                                    onClick={() => approveLeave(emp.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                                                    title="Add to Leave Out List"
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
            )}

            {/* Add Employee Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-xl">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold dark:text-white">Add New Employee</h3>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <X className="dark:text-white" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter name"
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.name}
                                        onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Father Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter father's name"
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.father_name}
                                        onChange={(e) => setNewEmp({ ...newEmp, father_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Grandfather Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter grandfather's name"
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.grand_father_name}
                                        onChange={(e) => setNewEmp({ ...newEmp, grand_father_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Sex</label>
                                    <select
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.sex}
                                        onChange={(e) => setNewEmp({ ...newEmp, sex: e.target.value })}
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Position</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Engineer, Driver"
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.position}
                                        onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Employment Status</label>
                                    <select
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.employment_status}
                                        onChange={(e) => setNewEmp({ ...newEmp, employment_status: e.target.value })}
                                    >
                                        <option value="Permanent">Permanent</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="09..."
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.phone_number}
                                        onChange={(e) => setNewEmp({ ...newEmp, phone_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Project Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Assign project"
                                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newEmp.project}
                                        onChange={(e) => setNewEmp({ ...newEmp, project: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20"
                                    >
                                        {submitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                <span>Register Employee</span>
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
