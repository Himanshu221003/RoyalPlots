import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import API_URL from '../config/api';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, SlidersHorizontal, X, MapPin, BedDouble, 
    Bath, Square, ChevronRight, RotateCcw, Sparkles,
    Building2, Home, Landmark, Hotel, Warehouse
} from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

export default function Property() {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Advanced Filters State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState('all');
    const [city, setCity] = useState(searchParams.get('city') || 'All');

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
        setCity(searchParams.get('city') || 'All');
    }, [searchParams]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('Any');
    const [bathrooms, setBathrooms] = useState('Any');
    const [propertyType, setPropertyType] = useState('All');

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const cities = ['All', 'Indore', 'Bhopal', 'Gwalior', 'Rewa', 'Jabalpur', 'Ujjain'];
    const propertyTypes = [
        { name: 'All', icon: Building2 },
        { name: 'Luxury Villa', icon: Home },
        { name: 'Modern Flat', icon: Hotel },
        { name: 'Penthouse', icon: Landmark },
        { name: 'Heritage Home', icon: Landmark },
        { name: 'Commercial', icon: Warehouse }
    ];

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, category, city, minPrice, maxPrice, bedrooms, bathrooms, propertyType, properties]);

    const fetchProperties = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                const approvedData = data.properties.filter(p => p.status === 'Approved');
                setProperties(approvedData);
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let results = [...properties];

        // Search Term
        if (searchTerm) {
            results = results.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category
        if (category !== 'all') {
            results = results.filter(p => p.category === category);
        }

        // City
        if (city !== 'All') {
            results = results.filter(p => p.location.toLowerCase().includes(city.toLowerCase()));
        }

        // Price Range
        if (minPrice) {
            results = results.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
            results = results.filter(p => p.price <= Number(maxPrice));
        }

        // Bedrooms
        if (bedrooms !== 'Any') {
            const count = parseInt(bedrooms);
            results = results.filter(p => p.bedrooms >= count);
        }

        // Bathrooms
        if (bathrooms !== 'Any') {
            const count = parseInt(bathrooms);
            results = results.filter(p => p.bathrooms >= count);
        }

        // Property Type (Filtering by title or description if no explicit field exists)
        if (propertyType !== 'All') {
            results = results.filter(p => 
                p.title.toLowerCase().includes(propertyType.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(propertyType.toLowerCase()))
            );
        }

        setFilteredProperties(results);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategory('all');
        setCity('All');
        setMinPrice('');
        setMaxPrice('');
        setBedrooms('Any');
        setBathrooms('Any');
        setPropertyType('All');
    };

    return (
        <div className="bg-background dark:bg-dark-bg text-on-surface dark:text-dark-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-24 sm:pt-32 container-responsive space-y-12">
                {/* Advanced Search Hub */}
                <section className="space-y-10">
                    <div className="max-w-5xl mx-auto space-y-10">
                        <div className="flex gap-4">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 glass dark:glass-dark rounded-[2.5rem] px-10 py-6 flex items-center gap-5 shadow-2xl border-white/30"
                            >
                                <Search className="w-6 h-6 text-primary dark:text-white opacity-40" />
                                <input 
                                    className="bg-transparent border-none focus:ring-0 w-full text-primary dark:text-white placeholder:text-primary/10 dark:placeholder:text-white/20 font-black text-xl" 
                                    placeholder="Search districts, villas, or estates..." 
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </motion.div>
                            <motion.button 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-2xl ${isFilterOpen ? 'bg-primary dark:bg-accent text-white' : 'bg-white dark:bg-dark-surface text-primary dark:text-dark-primary border border-surface-variant dark:border-dark-surface-variant'}`}
                            >
                                {isFilterOpen ? <X className="w-7 h-7" /> : <SlidersHorizontal className="w-7 h-7" />}
                            </motion.button>
                        </div>

                        {/* Expandable Filter Grid */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[4rem] p-12 shadow-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 dark:text-dark-on-surface-variant/40 px-2">Valuation Bracket (₹)</label>
                                            <div className="flex gap-4">
                                                <input type="number" placeholder="Min" className="w-full bg-surface-variant/20 dark:bg-dark-surface-variant/20 rounded-2xl px-6 py-4 border-none font-bold text-sm text-primary dark:text-white" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                                                <input type="number" placeholder="Max" className="w-full bg-surface-variant/20 dark:bg-dark-surface-variant/20 rounded-2xl px-6 py-4 border-none font-bold text-sm text-primary dark:text-white" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 dark:text-dark-on-surface-variant/40 px-2">Minimum Suites</label>
                                            <div className="flex gap-2">
                                                {['Any', '1+', '2+', '3+', '4+'].map(val => (
                                                    <button key={val} onClick={() => setBedrooms(val)} className={`flex-1 py-4 rounded-xl font-black text-[10px] transition-all border ${bedrooms === val ? 'bg-primary dark:bg-accent text-white border-primary dark:border-accent' : 'bg-surface-variant/10 dark:bg-dark-surface-variant/10 text-primary dark:text-white border-transparent hover:border-primary/20'}`}>
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 dark:text-dark-on-surface-variant/40 px-2">Regional Operational Area</label>
                                            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-surface-variant/20 dark:bg-dark-surface-variant/20 rounded-[1.5rem] px-6 py-5 border-none font-bold text-sm text-primary dark:text-white shadow-inner">
                                                {cities.map(c => <option key={c} value={c} className="bg-white dark:bg-dark-surface">{c}</option>)}
                                            </select>
                                        </div>

                                        <div className="lg:col-span-3 flex items-center justify-between border-t border-surface-variant/40 dark:border-dark-surface-variant/40 pt-8">
                                            <button onClick={resetFilters} className="flex items-center gap-3 text-error font-black uppercase tracking-widest text-[10px] hover:underline">
                                                <RotateCcw className="w-4 h-4" />
                                                Purge Filters
                                            </button>
                                            <button onClick={() => setIsFilterOpen(false)} className="bg-primary dark:bg-accent text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl">Apply Parameters</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Quick Category Tabs */}
                        <div className="flex justify-center flex-wrap gap-4">
                            {['all', 'buy', 'rent'].map((cat) => (
                                <button 
                                    key={cat} 
                                    onClick={() => setCategory(cat)}
                                    className={`px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${category === cat ? 'bg-secondary dark:bg-accent text-white scale-105' : 'bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant text-primary dark:text-dark-on-surface hover:border-accent'}`}
                                >
                                    {cat === 'all' ? 'Universal Catalog' : cat === 'buy' ? 'Acquisition' : 'Leasing'}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="space-y-12">
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-6 border-b border-surface-variant dark:border-dark-surface-variant pb-8">
                        <div className="space-y-2">
                            <h2 className="font-headline font-black text-5xl text-primary dark:text-dark-on-surface tracking-tighter uppercase italic">The Collection</h2>
                            <p className="text-accent font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                {filteredProperties.length} Verified High-Value Assets
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-40 glass dark:glass-dark rounded-[4rem] space-y-8">
                             <div className="w-24 h-24 bg-primary/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-10 h-10 text-primary/20 dark:text-white/20" />
                             </div>
                             <div className="space-y-4">
                                <h3 className="font-black text-3xl text-primary dark:text-dark-on-surface">No Matching Estates</h3>
                                <p className="text-on-surface-variant dark:text-dark-on-surface-variant font-bold max-w-sm mx-auto">Our current portfolio doesn't match these specific criteria. Try broadening your search parameters.</p>
                             </div>
                             <button onClick={resetFilters} className="text-accent font-black underline uppercase tracking-widest text-xs">Reset All Parameters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            <AnimatePresence>
                                {filteredProperties.map((prop, i) => (
                                    <motion.div 
                                        key={prop._id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link 
                                            to={`/property/${prop._id}`} 
                                            className="group block bg-white dark:bg-dark-surface rounded-[4rem] overflow-hidden border border-surface-variant/40 dark:border-dark-surface-variant/40 shadow-xl hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4"
                                        >
                                            <div className="relative aspect-[16/11] overflow-hidden bg-black/5">
                                                <img alt={prop.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src={(prop.images && prop.images[0]) || prop.coverImage} />
                                                <div className="absolute top-8 left-8 glass dark:glass-dark px-6 py-3 rounded-2xl shadow-2xl">
                                                    <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-widest leading-none">₹ {prop.price.toLocaleString()}</span>
                                                </div>
                                                <div className="absolute bottom-8 right-8">
                                                    <div className="bg-accent text-white px-5 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl">
                                                        {prop.category || 'Luxury'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-10 space-y-8">
                                                <div className="space-y-3">
                                                    <h3 className="font-headline font-black text-3xl text-primary dark:text-dark-on-surface leading-tight group-hover:text-accent transition-colors line-clamp-1">{prop.title}</h3>
                                                    <div className="flex items-center gap-3 text-on-surface-variant dark:text-dark-on-surface-variant font-bold text-sm italic opacity-60">
                                                        <MapPin className="w-4 h-4 text-accent" />
                                                        <span className="truncate">{prop.location}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 py-8 border-y border-surface-variant/30 dark:border-dark-surface-variant/30">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <BedDouble className="w-5 h-5 text-accent" />
                                                        <span className="text-[9px] font-black text-primary dark:text-white uppercase">{prop.bedrooms || 3} Suites</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2 border-x border-surface-variant/30 dark:border-dark-surface-variant/30">
                                                        <Bath className="w-5 h-5 text-accent" />
                                                        <span className="text-[9px] font-black text-primary dark:text-white uppercase">{prop.bathrooms || 2} Baths</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Square className="w-5 h-5 text-accent" />
                                                        <span className="text-[9px] font-black text-primary dark:text-white uppercase truncate">{prop.area || '2.4K'} SQFT</span>
                                                    </div>
                                                </div>
                                                
                                                <button className="w-full bg-primary dark:bg-accent text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] group-hover:bg-secondary dark:group-hover:bg-white dark:group-hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4">
                                                    Explore Residence
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                </button>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>
            </main>

            <BottomNav />
        </div>
    );
}
