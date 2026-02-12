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
            // Refresh materials
            const matRes = await api.get('/materials');
            setMaterials(matRes.data);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight dark:text-white">Material Issuance</h2>
                <p className="text-slate-500 dark:text-slate-400">Assign materials to employees.</p>
            </div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-center space-x-3 text-emerald-600 dark:text-emerald-400"
                >
                    <Check size={20} />
                    <span className="font-medium">Materials issued successfully!</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Step 1: Employee Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                        <span>Select Employee</span>
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                            value={empSearch}
                            onChange={(e) => setEmpSearch(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl max-h-[300px] overflow-y-auto shadow-sm">
                        {employees.filter(e => `${e.name} ${e.father_name}`.toLowerCase().includes(empSearch.toLowerCase())).map(emp => (
                            <button
                                key={emp.id}
                                onClick={() => setSelectedEmp(emp)}
                                className={`w-full flex items-center space-x-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800 ${selectedEmp?.id === emp.id ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary-600">
                                    {emp.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-sm dark:text-white">{emp.name} {emp.father_name}</p>
                                    <p className="text-xs text-slate-500">{emp.position}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Material Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                        <span>Select Materials</span>
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                            value={matSearch}
                            onChange={(e) => setMatSearch(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl max-h-[300px] overflow-y-auto shadow-sm">
                        {materials
                            .filter(m => m.status === 'available')
                            .filter(m => m.name.toLowerCase().includes(matSearch.toLowerCase()) || m.serial_number.toLowerCase().includes(matSearch.toLowerCase()))
                            .map(mat => (
                                <button
                                    key={mat.id}
                                    onClick={() => toggleMat(mat)}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800 ${selectedMats.find(m => m.id === mat.id) ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-600' : ''}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Package size={20} className="text-slate-400" />
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{mat.name}</p>
                                            <p className="text-xs text-slate-500 font-mono italic">{mat.serial_number}</p>
                                        </div>
                                    </div>
                                    {selectedMats.find(m => m.id === mat.id) && <Check size={18} className="text-primary-600" />}
                                </button>
                            ))}
                    </div>
                </div>
            </div>

            {/* Step 3: Confirmation */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-6 dark:text-white flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span>Review & Issue</span>
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-2 block">Issuing to:</label>
                            {selectedEmp ? (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center space-x-3">
                                    <User size={20} className="text-primary-600" />
                                    <span className="font-bold dark:text-white">{selectedEmp.name} {selectedEmp.father_name}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No employee selected</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-2 block">Purpose (Optional):</label>
                            <input
                                type="text"
                                placeholder="e.g. Field work in Project X"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-2 block">Items Selected ({selectedMats.length}):</label>
                        <div className="flex flex-wrap gap-2">
                            {selectedMats.length > 0 ? selectedMats.map(mat => (
                                <span key={mat.id} className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg font-medium text-sm">
                                    <span>{mat.name}</span>
                                    <button onClick={() => toggleMat(mat)} className="hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </span>
                            )) : (
                                <p className="text-sm text-slate-400 italic">No items selected</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button
                            disabled={!selectedEmp || selectedMats.length === 0 || loading}
                            onClick={handleBorrow}
                            className="w-full md:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
                        >
                            <ClipboardCheck size={20} />
                            <span>{loading ? 'Processing...' : 'Issue Materials'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Borrow;
