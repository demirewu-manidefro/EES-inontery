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
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'available', or 'borrowed'

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
            // Pass the current tab filter to backend
            const response = await api.get(`/materials/export?status=${activeTab}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Set filename based on filter
            const filename = activeTab === 'available' ? 'available_materials.xlsx' :
                activeTab === 'borrowed' ? 'borrowed_materials.xlsx' :
                    'inventory_list.xlsx';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Failed to export inventory: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredMaterials = materials.filter(mat => {
        const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mat.serial_number.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'available') {
            return matchesSearch && mat.status === 'available';
        }
        if (activeTab === 'borrowed') {
            return matchesSearch && mat.status === 'borrowed';
        }
        return matchesSearch;
    });

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Inventory Core</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">National asset tracking and hardware lifecycle management.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all shadow-xl shadow-cyan-500/20 font-black uppercase tracking-widest text-[11px] border border-cyan-400/30 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Hardware</span>
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
                        <Upload size={20} />
                        <span>Import Matrix</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800/40 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-xl transition-all font-black uppercase tracking-widest text-[11px] backdrop-blur-sm"
                    >
                        <FileSpreadsheet size={20} />
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
                        Full Repository
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.1)]' : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800/50'}`}
                    >
                        Available
                    </button>
                    <button
                        onClick={() => setActiveTab('borrowed')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'borrowed' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800/50'}`}
                    >
                        Tier 1 Allocated
                    </button>
                </div>

                <div className="relative flex-1 sm:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="SCAN HARDWARE SERIALS..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-cyan-500/10 rounded-xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-700 text-[11px] font-black tracking-widest shadow-inner overflow-hidden"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-cyan-500/50 font-black uppercase tracking-[0.2em] text-[10px]">Scanning Inventory Matrix...</p>
                </div>
            ) : (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] shadow-3xl border border-cyan-500/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-cyan-500/10">
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.2em] whitespace-nowrap">Hardware Identifier</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap font-mono">Serial_Index</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Status_Code</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] whitespace-nowrap">Entry_Log</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] text-right whitespace-nowrap">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredMaterials.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-700 font-black uppercase tracking-widest italic">No hardware profiles found in database.</td>
                                    </tr>
                                ) : (
                                    filteredMaterials.map((mat) => (
                                        <tr key={mat.id} className="hover:bg-cyan-500/5 transition-all group/row">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-11 h-11 rounded-xl bg-slate-950 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner group-hover/row:scale-110 group-hover/row:border-cyan-500 transition-all duration-500">
                                                        <Package size={22} className="group-hover/row:rotate-12 transition-transform" />
                                                    </div>
                                                    <span className="font-black text-slate-100 uppercase tracking-tight text-sm">{mat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] font-mono font-bold text-slate-400 tracking-wider">
                                                {mat.serial_number}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border ${mat.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                                    mat.status === 'borrowed' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                                                        'bg-slate-800/50 text-slate-500 border-slate-700'
                                                    }`}>
                                                    {mat.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                {new Date(mat.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => setEditingMat(mat)}
                                                    className="px-5 py-2.5 bg-slate-800/50 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                                >
                                                    Modify Profile
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

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-md shadow-3xl border border-cyan-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">New Asset</h3>
                                        <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest mt-1">Registry Protocol 4.0</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Hardware Nomenclature</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. RADIOMETRIC SCANNER, GPS UNIT"
                                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner placeholder-slate-800"
                                        value={newMat.name}
                                        onChange={(e) => setNewMat({ ...newMat, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Serial Authentication Index</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="SN-XXXX-XXXX-XXXX"
                                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner placeholder-slate-800"
                                        value={newMat.serial_number}
                                        onChange={(e) => setNewMat({ ...newMat, serial_number: e.target.value })}
                                    />
                                </div>

                                <div className="pt-6">
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
                                                <span>Register Asset</span>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-10 w-full max-w-md shadow-3xl border border-cyan-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Modify Asset</h3>
                                <button onClick={() => setEditingMat(null)} className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Hardware Nomenclature</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner"
                                        value={editingMat.name}
                                        onChange={(e) => setEditingMat({ ...editingMat, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Serial Authentication Index</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner"
                                        value={editingMat.serial_number}
                                        onChange={(e) => setEditingMat({ ...editingMat, serial_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 block">Status Designation</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm shadow-inner appearance-none relative"
                                        value={editingMat.status}
                                        onChange={(e) => setEditingMat({ ...editingMat, status: e.target.value })}
                                    >
                                        <option value="available">AVAILABLE</option>
                                        <option value="borrowed">BORROWED</option>
                                        <option value="maintenance">MAINTENANCE</option>
                                        <option value="lost">LOST</option>
                                    </select>
                                </div>

                                <div className="pt-6">
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
                                                <span>Update Repository</span>
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
