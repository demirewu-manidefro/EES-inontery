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
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight dark:text-white">Material Return</h2>
                <p className="text-slate-500 dark:text-slate-400">Process returned materials from employees.</p>
            </div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-center space-x-3 text-emerald-600 dark:text-emerald-400"
                >
                    <Check size={20} />
                    <span className="font-medium">Items returned successfully!</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Employee Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white">Find Employee</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                            value={empSearch}
                            onChange={(e) => setEmpSearch(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl max-h-[400px] overflow-y-auto shadow-sm">
                        {employees.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No employees with borrowed items found.</div>
                        ) : (
                            employees.filter(e => `${e.name} ${e.father_name}`.toLowerCase().includes(empSearch.toLowerCase())).map(emp => (
                                <button
                                    key={emp.id}
                                    onClick={() => handleSelectEmp(emp)}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800 ${selectedEmp?.id === emp.id ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-600' : ''}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary-600">
                                            {emp.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{emp.name} {emp.father_name}</p>
                                            <p className="text-xs text-slate-500">{emp.BorrowedMaterials.length} items borrowed</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Item Fulfillment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white">Borrowed Items</h3>
                    {selectedEmp ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-bold text-sm dark:text-white">Returning for: {selectedEmp.name}</span>
                                <button
                                    onClick={() => setSelectedItems(borrowings.map(b => b.id))}
                                    className="text-xs font-bold text-primary-600 hover:underline"
                                >
                                    Select All
                                </button>
                            </div>
                            <div className="max-h-[340px] overflow-y-auto">
                                {borrowings.map((b) => (
                                    <button
                                        key={b.id}
                                        onClick={() => toggleItem(b.id)}
                                        className="w-full flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800 text-left"
                                    >
                                        <div className="text-primary-600">
                                            {selectedItems.includes(b.id) ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm dark:text-white">{b.Material?.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">SN: {b.Material?.serial_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400">Borrowed on:</p>
                                            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{new Date(b.borrow_date).toLocaleDateString()}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800">
                                <button
                                    disabled={selectedItems.length === 0 || loading}
                                    onClick={handleReturn}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
                                >
                                    <RotateCcw size={18} />
                                    <span>{loading ? 'Processing...' : `Return ${selectedItems.length} Items`}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                            <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 mb-4">
                                <User size={24} />
                            </div>
                            <p className="text-slate-500">Select an employee from the left to view their borrowed materials.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Return;
