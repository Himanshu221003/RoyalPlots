import { motion, AnimatePresence } from 'framer-motion';
import { useComparison } from '../context/ComparisonContext';
import { X, Scale, ArrowRight, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function Comparison() {
    const { compareList, removeFromCompare, clearCompare } = useComparison();
    const navigate = useNavigate();

    const specs = [
        { key: 'price', label: 'Valuation', format: (v) => `₹ ${v.toLocaleString()}` },
        { key: 'area', label: 'Total Area', format: (v) => `${v || 2400} SQFT` },
        { key: 'bedrooms', label: 'Bedrooms', format: (v) => `${v || 3} BHK` },
        { key: 'bathrooms', label: 'Bathrooms', format: (v) => v || 2 },
        { key: 'location', label: 'Location' },
        { key: 'category', label: 'Transaction' },
    ];

    return (
        <div className="bg-background dark:bg-dark-bg min-h-screen pb-32">
            <Navbar />

            <main className="pt-32 container-responsive space-y-16">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest"
                        >
                            <Scale className="w-3 h-3" />
                            Side-by-Side Analysis
                        </motion.div>
                        <h1 className="font-headline font-black text-4xl sm:text-7xl text-primary dark:text-dark-on-surface tracking-tighter">
                            Estate <span className="text-secondary opacity-20">Comparison</span>
                        </h1>
                    </div>
                    {compareList.length > 0 && (
                        <button 
                            onClick={clearCompare}
                            className="text-[10px] font-black uppercase tracking-widest text-error hover:underline"
                        >
                            Reset Comparator
                        </button>
                    )}
                </div>

                {compareList.length === 0 ? (
                    <div className="py-40 text-center space-y-8 glass dark:glass-dark rounded-[4rem]">
                        <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                            <Scale className="w-10 h-10 text-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-headline font-black text-3xl text-primary/40 leading-tight">No Estates Selected</h3>
                            <p className="text-on-surface-variant/40 font-bold">Add up to 4 properties from the catalog to compare their specifications.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/properties')}
                            className="bg-primary text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px]"
                        >
                            Go to Catalog
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {compareList.map((prop) => (
                                <motion.div 
                                    key={prop._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col gap-8 group"
                                >
                                    <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border border-surface-variant dark:border-dark-surface-variant ring-0 group-hover:ring-8 ring-accent/10 transition-all">
                                        <img src={prop.images?.[0] || prop.coverImage} className="w-full h-full object-cover" alt="" />
                                        <button 
                                            onClick={() => removeFromCompare(prop._id)}
                                            className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 transition-all"
                                        >
                                            <Minus className="w-6 h-6" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                                            <h4 className="text-xl font-black text-white truncate">{prop.title}</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-6 px-4">
                                        {specs.map((spec) => (
                                            <div key={spec.key} className="space-y-1 group/spec px-4 py-3 rounded-2xl hover:bg-primary/5 dark:hover:bg-dark-primary/5 transition-all">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-dark-on-surface-variant/40">{spec.label}</p>
                                                <p className="text-lg font-black text-primary dark:text-dark-on-surface">
                                                    {spec.format ? spec.format(prop[spec.key]) : prop[spec.key]}
                                                </p>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => navigate(`/property/${prop._id}`)}
                                            className="w-full py-5 bg-primary dark:bg-dark-surface border border-primary/20 dark:border-dark-primary/20 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white dark:text-dark-primary hover:bg-accent hover:text-white transition-all shadow-xl"
                                        >
                                            View Dossier
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
