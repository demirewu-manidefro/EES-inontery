import React, { useState, useEffect } from 'react';
import { Search, User, Package, ClipboardCheck, X, Check } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Borrow = () => {
    const [employees, setEmployees] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [selectedMats, setSelectedMats] = useState([]);
    const [purpose, setPurpose] = useState('');
    const [empSearch, setEmpSearch] = useState('');
    const [matSearch, setMatSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, matRes] = await Promise.all([
                    api.get('/employees'),
                    api.get('/materials')
                ]);
                setEmployees(empRes.data);
                setMaterials(matRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const toggleMat = (mat) => {
        if (selectedMats.find(m => m.id === mat.id)) {
            setSelectedMats(selectedMats.filter(m => m.id !== mat.id));
        } else {
            setSelectedMats([...selectedMats, mat]);
        }
    };

    const handleBorrow = async () => {
        if (!selectedEmp || selectedMats.length === 0) return;
        setLoading(true);
        try {
            await api.post('/borrow/borrow', {
                employee_id: selectedEmp.id,
                material_ids: selectedMats.map(m => m.id),
                purpose
            });
            setSuccess(true);
            setSelectedEmp(null);
            setSelectedMats([]);
            setPurpose('');
            const matRes = await api.get('/materials');
            setMaterials(matRes.data);
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">Asset Deployment</h2>
                    <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Strategic resource allocation and personnel linking.</p>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full shadow-lg shadow-cyan-500/20"></div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-slate-900/40 rounded-2xl border border-cyan-500/10 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">Secure Link Active</span>
                </div>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center space-x-4 text-emerald-400 backdrop-blur-3xl shadow-3xl shadow-emerald-500/10 relative">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check size={24} className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            </div>
                            <div>
                                <h4 className="font-black uppercase text-xs tracking-widest leading-none">Transmission Confirmed</h4>
                                <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tight mt-1">Hardware assets have been successfully linked to personnel identity.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Step 1: Employee Selection */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center space-x-3">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 border border-cyan-500/20 flex items-center justify-center font-black text-cyan-400 shadow-xl">01</span>
                            <span>Target Personnel</span>
                        </h3>
                        {selectedEmp && (
                            <button onClick={() => setSelectedEmp(null)} className="text-[9px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-400 transition-colors">Clear Target</button>
                        )}
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH BY IDENTITY..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-cyan-500/10 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder-slate-800 font-bold text-sm shadow-inner"
                            value={empSearch}
                            onChange={(e) => setEmpSearch(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-3xl border border-cyan-500/10 rounded-[2rem] h-[400px] overflow-y-auto shadow-4xl divide-y divide-slate-800/50 scrollbar-hide">
                        {employees.filter(e => `${e.name} ${e.father_name}`.toLowerCase().includes(empSearch.toLowerCase())).length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                                <User size={48} className="opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No Identity Match Found</p>
                            </div>
                        ) : (
                            employees.filter(e => `${e.name} ${e.father_name}`.toLowerCase().includes(empSearch.toLowerCase())).map(emp => (
                                <button
                                    key={emp.id}
                                    onClick={() => setSelectedEmp(emp)}
                                    className={`w-full flex items-center space-x-5 p-5 text-left hover:bg-cyan-500/5 transition-all relative group/item ${selectedEmp?.id === emp.id ? 'bg-cyan-500/10' : ''}`}
                                >
                                    {selectedEmp?.id === emp.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>}
                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-cyan-400 shadow-xl group-hover/item:border-cyan-500/30 transition-all">
                                        {emp.name[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-[13px] uppercase tracking-tighter text-white truncate">{emp.name} {emp.father_name}</p>
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{emp.phone}</span>
                                        </div>
                                        <p className="text-[10px] text-cyan-500/50 font-black uppercase tracking-widest mt-0.5 mt-1">{emp.position}</p>
                                    </div>
                                    {selectedEmp?.id === emp.id && (
                                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white scale-110 shadow-lg shadow-cyan-500/20">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Step 2: Material Selection */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center space-x-3">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 shadow-xl">02</span>
                            <span>Asset Inventory</span>
                        </h3>
                        {selectedMats.length > 0 && (
                            <button onClick={() => setSelectedMats([])} className="text-[9px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-400 transition-colors">Deselect All</button>
                        )}
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH BY SERIAL/NAME..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-indigo-500/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-800 font-bold text-sm shadow-inner"
                            value={matSearch}
                            onChange={(e) => setMatSearch(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-3xl border border-indigo-500/10 rounded-[2rem] h-[400px] overflow-y-auto shadow-4xl divide-y divide-slate-800/50 scrollbar-hide">
                        {materials
                            .filter(m => m.status === 'available')
                            .filter(m => m.name.toLowerCase().includes(matSearch.toLowerCase()) || m.serial_number.toLowerCase().includes(matSearch.toLowerCase())).length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                                <Package size={48} className="opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No Hardware Available</p>
                            </div>
                        ) : (
                            materials
                                .filter(m => m.status === 'available')
                                .filter(m => m.name.toLowerCase().includes(matSearch.toLowerCase()) || m.serial_number.toLowerCase().includes(matSearch.toLowerCase()))
                                .map(mat => (
                                    <button
                                        key={mat.id}
                                        onClick={() => toggleMat(mat)}
                                        className={`w-full flex items-center justify-between p-5 text-left hover:bg-indigo-500/5 transition-all group/item ${selectedMats.find(m => m.id === mat.id) ? 'bg-indigo-500/10' : ''}`}
                                    >
                                        <div className="flex items-center space-x-5 min-w-0">
                                            <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-xl group-hover/item:border-indigo-500/30 transition-all ${selectedMats.find(m => m.id === mat.id) ? 'scale-90 border-indigo-500' : ''}`}>
                                                <Package size={22} className={selectedMats.find(m => m.id === mat.id) ? 'rotate-12 transition-transform' : ''} />
                                            </div>
                                            <div className="min-w-0 overflow-hidden">
                                                <p className="font-black text-[13px] uppercase tracking-tighter text-white truncate">{mat.name}</p>
                                                <p className="text-[9px] text-indigo-500/60 font-mono font-bold italic mt-1 tracking-widest uppercase truncate">{mat.serial_number}</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${selectedMats.find(m => m.id === mat.id) ? 'bg-indigo-500 border-indigo-500 scale-110 shadow-lg shadow-indigo-500/20' : 'border-slate-800 bg-slate-950'}`}>
                                            {selectedMats.find(m => m.id === mat.id) && <Check size={14} className="text-white" />}
                                        </div>
                                    </button>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* Step 3: Confirmation */}
            <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] shadow-5xl border border-cyan-500/10 relative overflow-hidden group/final">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] -z-10 transition-all duration-1000 group-hover/final:bg-cyan-500/10"></div>
                <h3 className="text-[10px] font-black mb-10 text-slate-500 uppercase tracking-[0.4em] flex items-center space-x-4">
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white flex items-center justify-center font-black shadow-2xl shadow-blue-500/20">03</span>
                    <span>Deployment Review</span>
                </h3>

                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div layout className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] ml-1">Identity Lock</label>
                            <AnimatePresence mode="wait">
                                {selectedEmp ? (
                                    <motion.div
                                        key="selected"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-6 bg-slate-950/60 border border-cyan-500/20 rounded-[2rem] flex items-center space-x-5 shadow-inner group/card"
                                    >
                                        <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover/card:scale-110 transition-transform">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <span className="font-black text-white uppercase tracking-tighter text-lg leading-none block">{selectedEmp.name} {selectedEmp.father_name}</span>
                                            <span className="text-[9px] text-cyan-500/60 font-black uppercase tracking-widest mt-1 block">Authentication Verified</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        className="h-[100px] border-2 border-dashed border-slate-900 rounded-[2rem] flex flex-col items-center justify-center space-y-2 opacity-40"
                                    >
                                        <User size={24} className="text-slate-600" />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Awaiting Identity Input</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] ml-1">Deployment Objective</label>
                            <div className="relative h-full">
                                <input
                                    type="text"
                                    placeholder="DEFINE OPERATION PARAMETERS..."
                                    className="w-full h-[100px] md:h-full px-8 bg-slate-950/60 border border-cyan-500/10 rounded-[2rem] outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder-slate-900 font-bold text-sm shadow-inner text-center uppercase tracking-widest"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] ml-1">Asset Payload Manifest ({selectedMats.length} UNITS)</label>
                        <div className="flex flex-wrap gap-4 min-h-[60px]">
                            <AnimatePresence>
                                {selectedMats.length > 0 ? selectedMats.map((mat, i) => (
                                    <motion.span
                                        key={mat.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-flex items-center space-x-3 px-6 py-3 bg-slate-950/80 border border-indigo-500/30 text-indigo-400 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:border-indigo-400 hover:text-indigo-300 transition-all group/tag"
                                    >
                                        <Package size={14} className="opacity-60" />
                                        <span>{mat.name}</span>
                                        <button onClick={() => toggleMat(mat)} className="text-slate-700 hover:text-red-500 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </motion.span>
                                )) : (
                                    <div className="w-full h-20 border-2 border-dashed border-slate-900 rounded-[2rem] flex flex-col items-center justify-center space-y-2 opacity-40">
                                        <Package size={24} className="text-slate-600" />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Manifest Empty</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-1">Authorization Status</span>
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${(!selectedEmp || selectedMats.length === 0) ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${(!selectedEmp || selectedMats.length === 0) ? 'text-red-500/60' : 'text-emerald-500'}`}>
                                    {(!selectedEmp || selectedMats.length === 0) ? 'Ready check failed' : 'Protocol Authorized'}
                                </span>
                            </div>
                        </div>
                        <button
                            disabled={!selectedEmp || selectedMats.length === 0 || loading}
                            onClick={handleBorrow}
                            className={`w-full md:w-auto px-16 py-6 rounded-[2.2rem] font-black shadow-4xl transition-all active:scale-95 uppercase tracking-[0.3em] text-[15px] flex items-center justify-center gap-5 relative overflow-hidden group/btn ${(!selectedEmp || selectedMats.length === 0 || loading)
                                ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'
                                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white border border-cyan-400/30'}`}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white"></div>
                                    <span className="animate-pulse">Authorizing...</span>
                                </>
                            ) : (
                                <>
                                    <ClipboardCheck size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span>Deploy Assets</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Borrow;
