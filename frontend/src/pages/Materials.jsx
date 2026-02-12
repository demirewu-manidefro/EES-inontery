import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Search, Package, Hash, CheckCircle2, XCircle, X, Save, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [newMat, setNewMat] = useState({
        name: '',
        serial_number: ''
    });

    const [editingMat, setEditingMat] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await api.get('/materials');
            setMaterials(res.data);
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
            await api.post('/materials', newMat);
            setShowAddModal(false);
            setNewMat({ name: '', serial_number: '' });
            fetchMaterials();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add material');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/materials/${editingMat.id}`, editingMat);
            setEditingMat(null);
            fetchMaterials();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update material');
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
            const res = await api.post('/materials/bulk-upload', formData);
            alert(res.data.message);
            fetchMaterials();
        } catch (err) {
            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/materials/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventory_list.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Failed to export inventory: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredMaterials = materials.filter(mat =>
        mat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mat.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-white">Inventory</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track company materials.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                    >
                        <Plus size={20} />
                        <span className="font-bold">Add Material</span>
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
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                    >
                        <Upload size={20} />
                        <span className="font-bold">Import</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <FileSpreadsheet size={20} />
                        <span className="font-bold">Export</span>
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or serial number..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="bg-slate-900/50 rounded-3xl shadow-sm border border-slate-800 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">Material Name</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 font-mono">Serial Number</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">Added Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500 italic">No materials found matching your search.</td>
                                </tr>
                            ) : (
                                filteredMaterials.map((mat) => (
                                    <tr key={mat.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-primary-400 flex items-center justify-center">
                                                    <Package size={20} />
                                                </div>
                                                <span className="font-bold text-slate-100">{mat.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-slate-400">
                                            {mat.serial_number}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${mat.status === 'available' ? 'bg-emerald-900/30 text-emerald-400' :
                                                mat.status === 'borrowed' ? 'bg-amber-900/30 text-amber-500' :
                                                    'bg-slate-800 text-slate-400'
                                                }`}>
                                                {mat.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">
                                            {new Date(mat.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setEditingMat(mat)}
                                                className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
                                            >
                                                Edit Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Material Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold dark:text-white">Add New Material</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <X className="dark:text-white" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Material Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Laptop, GPS, Camera"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newMat.name}
                                        onChange={(e) => setNewMat({ ...newMat, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Serial Number</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. SN-123456"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={newMat.serial_number}
                                        onChange={(e) => setNewMat({ ...newMat, serial_number: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
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
                                                <span>Save Material</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Material Modal */}
            <AnimatePresence>
                {editingMat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold dark:text-white">Edit Material</h3>
                                <button onClick={() => setEditingMat(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <X className="dark:text-white" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Material Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={editingMat.name}
                                        onChange={(e) => setEditingMat({ ...editingMat, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Serial Number</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={editingMat.serial_number}
                                        onChange={(e) => setEditingMat({ ...editingMat, serial_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Status</label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={editingMat.status}
                                        onChange={(e) => setEditingMat({ ...editingMat, status: e.target.value })}
                                    >
                                        <option value="available">Available</option>
                                        <option value="borrowed">Borrowed</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>

                                <div className="pt-4">
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
                                                <span>Update Material</span>
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

export default Materials;
