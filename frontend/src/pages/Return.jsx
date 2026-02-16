import React, { useState, useEffect } from 'react';
import { Search, User, Package, RotateCcw, Check, CheckSquare, Square } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Return = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [borrowings, setBorrowings] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [empSearch, setEmpSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const res = await api.get('/employees');
        // Only employees with active borrowings
        setEmployees(res.data.filter(e => e.BorrowedMaterials?.length > 0));
    };

    const handleSelectEmp = (emp) => {
        setSelectedEmp(emp);
        setBorrowings(emp.BorrowedMaterials || []);
        setSelectedItems([]); // Reset selection
    };

    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleReturn = async () => {
        if (selectedItems.length === 0) return;
        setLoading(true);
        try {
            await api.post('/borrow/return-individual', {
                borrowed_ids: selectedItems
            });
            setSuccess(true);
            // Refresh
            await fetchEmployees();
            setSelectedEmp(null);
            setBorrowings([]);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Resource Recovery</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">De-allocating hardware assets and updating registry logs.</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
                </div>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                        <Check size={20} className="animate-pulse" />
                        <span className="font-black uppercase tracking-widest text-[11px]">Database Synchronized</span>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Employee Selection */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase text-cyan-500/60 tracking-[0.3em]">Personnel Scan</h3>
                        <span className="text-[10px] font-mono text-slate-700">ACTIVE_LOANS: {employees.length}</span>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME OR ID..."
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-cyan-500/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-slate-700 text-[11px] font-black tracking-widest shadow-inner"
                            value={empSearch}
                            onChange={(e) => setEmpSearch(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-3xl border border-cyan-500/10 rounded-[2rem] max-h-[500px] overflow-y-auto scrollbar-hide shadow-2xl relative">
                        <div className="sticky top-0 left-0 w-full h-4 bg-gradient-to-b from-slate-900/80 to-transparent z-10"></div>
                        {employees.length === 0 ? (
                            <div className="p-20 text-center text-slate-700 font-black uppercase tracking-widest italic opacity-50">No active hardware loans detected in sector.</div>
                        ) : (
                            <div className="divide-y divide-slate-800/50">
                                {employees.filter(e => `${e.name} ${e.father_name}`.toLowerCase().includes(empSearch.toLowerCase())).map(emp => (
                                    <button
                                        key={emp.id}
                                        onClick={() => handleSelectEmp(emp)}
                                        className={`w-full flex items-center justify-between p-6 text-left transition-all group/btn ${selectedEmp?.id === emp.id ? 'bg-cyan-500/10 border-r-4 border-cyan-500 shadow-inner' : 'hover:bg-slate-800/40'}`}
                                    >
                                        <div className="flex items-center space-x-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 ${selectedEmp?.id === emp.id ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/20' : 'bg-slate-950 border border-cyan-500/20 text-cyan-400 group-hover/btn:border-cyan-500'}`}>
                                                {emp.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-[13px] text-slate-100 uppercase tracking-tight mb-0.5">{emp.name} {emp.father_name}</p>
                                                <p className="text-[10px] text-cyan-500/50 font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <Package size={12} />
                                                    {emp.BorrowedMaterials.length} Asset Units
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`transition-all duration-300 ${selectedEmp?.id === emp.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="sticky bottom-0 left-0 w-full h-4 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                    </div>
                </div>

                {/* Item Fulfillment */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-cyan-500/60 tracking-[0.3em]">Asset De-Allocation</h3>
                    {selectedEmp ? (
                        <div className="bg-slate-900/40 backdrop-blur-3xl border border-cyan-500/10 rounded-[2.5rem] overflow-hidden shadow-3xl">
                            <div className="p-6 bg-slate-950/50 border-b border-cyan-500/10 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">UNITS FOR RECOVERY</span>
                                    <span className="font-black text-sm text-cyan-400 uppercase tracking-tight">{selectedEmp.name} {selectedEmp.father_name}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedItems(borrowings.map(b => b.id))}
                                    className="text-[10px] font-black text-cyan-500 hover:text-cyan-400 uppercase tracking-[0.2em] transition-colors"
                                >
                                    Select All Units
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto scrollbar-hide divide-y divide-slate-800/50">
                                {borrowings.map((b) => (
                                    <button
                                        key={b.id}
                                        onClick={() => toggleItem(b.id)}
                                        className="w-full flex items-center space-x-5 p-6 hover:bg-slate-800/40 transition-all text-left group/item"
                                    >
                                        <div className={`transition-all duration-300 ${selectedItems.includes(b.id) ? 'text-cyan-400 scale-110' : 'text-slate-800 group-hover/item:text-slate-600'}`}>
                                            {selectedItems.includes(b.id) ? <CheckSquare size={24} /> : <Square size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-[13px] text-slate-100 uppercase tracking-tight mb-1">{b.Material?.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">{b.Material?.serial_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Allocated</p>
                                            <p className="text-[10px] font-black text-slate-400 font-mono italic">{new Date(b.borrow_date).toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' })}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="p-8 bg-slate-950/50">
                                <button
                                    disabled={selectedItems.length === 0 || loading}
                                    onClick={handleReturn}
                                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-500/20 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-[12px] border border-emerald-400/20 active:scale-95"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <RotateCcw size={20} />
                                            <span>Execute Recovery ({selectedItems.length} Units)</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900/20 border-2 border-dashed border-cyan-500/10 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-20 h-20 bg-slate-950 border border-cyan-500/10 rounded-3xl flex items-center justify-center text-slate-800 shadow-inner">
                                <User size={40} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Awaiting Personnel Selection</p>
                                <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tight">Select a unit from the personnel scan to access recovery sub-modules.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Return;
