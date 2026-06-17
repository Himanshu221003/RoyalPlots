import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Scale, LayoutGrid, List, SlidersHorizontal, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Hero from '../components/Hero';
import PropertyReels from '../components/PropertyReels';
import NewsSection from '../components/NewsSection';
import Testimonials from '../components/Testimonials';
import { SkeletonCard } from '../components/Skeleton';

export default function HomeScreen() {
    const navigate = useNavigate();
    const { user, toggleFavorite } = useAuth();
    const { addToCompare, compareList } = useComparison();
    const [featured, setFeatured] = useState([]);
    const [activeTab, setActiveTab] = useState('BUY');
    const [loading, setLoading] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

    const favorites = user?.favorites || [];

    useEffect(() => {
        fetchFeaturedProperties();
    }, []);

    const fetchFeaturedProperties = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                const approved = data.properties.filter(p => p.status === 'Approved');
                setFeatured(approved.length > 0 ? approved.slice(0, 6) : fallbackData);
            } else {
                setFeatured(fallbackData);
            }
        } catch (err) {
            setFeatured(fallbackData);
        } finally {
            setLoading(false);
        }
    };

    const fallbackData = [
        { _id: '1', title: 'The Sapphire Manor', price: 24000000, bedrooms: 3, bathrooms: 2, location: 'Vijay Nagar, Indore', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop'], category: 'BUY' },
        { _id: '2', title: 'Lakeview Residency', price: 8500000, bedrooms: 2, bathrooms: 2, location: 'Arera Colony, Bhopal', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'], category: 'RENT' },
        { _id: '3', title: 'Heritage Greens', price: 12000000, bedrooms: 4, bathrooms: 3, location: 'City Center, Gwalior', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'], category: 'BUY' }
    ];

    return (
        <div className="bg-background dark:bg-dark-bg text-on-surface dark:text-dark-on-surface min-h-screen pb-24 overflow-x-hidden">
            <Navbar />

            <main>
                {/* Premium Animated Hero */}
                <Hero />

                {/* Property Reels */}
                <PropertyReels />

                {/* Featured Collection */}
                <section className="container-responsive py-24 space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-dark-primary/10 text-primary dark:text-dark-primary rounded-full text-[10px] font-black uppercase tracking-widest"
                            >
                                <LayoutGrid className="w-3 h-3" />
                                Curated Selection
                            </motion.div>
                            <h2 className="font-headline font-black text-4xl sm:text-7xl text-primary dark:text-dark-on-surface tracking-tighter">
                                Featured <span className="text-secondary opacity-20">Holdings</span>
                            </h2>
                        </div>
                        
                        <div className="flex bg-white dark:bg-dark-surface p-2 rounded-3xl border border-surface-variant dark:border-dark-surface-variant shadow-xl">
                            {['BUY', 'RENT'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-10 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${activeTab === tab ? 'bg-primary dark:bg-dark-primary text-white shadow-lg' : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                            {featured.filter(p => !activeTab || p.category === activeTab).map((prop, i) => (
                                <motion.div 
                                    key={prop._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group cursor-pointer flex flex-col gap-8"
                                    onClick={() => navigate(`/property/${prop._id}`)}
                                >
                                    <div className="relative overflow-hidden rounded-[4rem] aspect-[4/5] shadow-2xl bg-black/5 hover:-translate-y-4 transition-all duration-700">
                                        <img 
                                            alt={prop.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                            src={(prop.images && prop.images[0]) || prop.coverImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                                        />
                                        
                                        {/* Tags */}
                                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                                            <div className="glass dark:glass-dark px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
                                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-widest">Active</span>
                                            </div>
                                            <div className="bg-primary dark:bg-accent text-white px-6 py-3 rounded-2xl shadow-xl">
                                                <span className="text-[10px] font-black uppercase tracking-widest">₹ {typeof prop.price === 'number' ? prop.price.toLocaleString() : prop.price}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="absolute top-8 right-8 flex flex-col gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(prop._id); }}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${favorites.includes(prop._id) ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'glass dark:glass-dark text-white hover:text-red-500'}`}
                                            >
                                                <Heart className="w-6 h-6" fill={favorites.includes(prop._id) ? "currentColor" : "none"} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => { e.stopPropagation(); addToCompare(prop); }}
                                                className={`w-14 h-14 rounded-2xl glass dark:glass-dark flex items-center justify-center transition-all ${compareList.some(p => p._id === prop._id) ? 'bg-accent text-white shadow-lg' : 'text-white hover:text-accent'}`}
                                            >
                                                <Scale className="w-6 h-6" />
                                            </motion.button>
                                        </div>

                                        {/* Location Overlay */}
                                        <div className="absolute bottom-10 left-8 right-8 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="glass dark:glass-dark p-6 rounded-3xl flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                        <ArrowRight className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Explore details</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="font-headline font-black text-3xl text-primary dark:text-dark-on-surface leading-none tracking-tight">{prop.title}</h3>
                                            <span className="text-accent italic font-display text-lg">Indore</span>
                                        </div>
                                        <div className="flex items-center gap-8 text-on-surface-variant dark:text-dark-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                                                {prop.bedrooms || 3} Beds
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                                                {prop.bathrooms || 2} Baths
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary dark:bg-dark-primary rounded-full" />
                                                {prop.area || 2400} SQFT
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="text-center pt-12">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/properties')} 
                            className="inline-flex items-center gap-6 bg-primary dark:bg-accent text-white px-16 py-6 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 active:scale-95 group"
                        >
                            Explore Universal Catalog
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </motion.button>
                    </div>
                </section>

                {/* News & Intelligence */}
                <NewsSection />

                {/* Testimonials */}
                <Testimonials />

                {/* Call to Action */}
                <section className="container-responsive py-32">
                    <div className="bg-primary dark:bg-dark-surface rounded-[5rem] p-12 sm:p-24 relative overflow-hidden flex flex-col items-center text-center space-y-12 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent/20 opacity-50 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10 space-y-6 max-w-3xl">
                            <h2 className="font-headline font-black text-5xl sm:text-8xl text-white tracking-tighter leading-tight">
                                Ready to Elevate your <br />
                                <span className="text-accent italic font-display">Lifestyle?</span>
                            </h2>
                            <p className="text-white/60 font-bold text-lg sm:text-xl">Join 5,000+ investors and elite homeowners in Central India's most exclusive network.</p>
                        </div>
                        
                        {newsletterSubscribed ? (
                            <div className="relative z-10 w-full max-w-lg bg-white/10 border border-white/20 rounded-full py-5 px-10 text-white font-black text-[10px] uppercase tracking-widest text-center animate-pulse">
                                Access Granted — Welcome to the Network
                            </div>
                        ) : (
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (newsletterEmail) setNewsletterSubscribed(true);
                                }}
                                className="relative z-10 w-full max-w-lg flex flex-col sm:flex-row gap-4"
                            >
                                <input
                                    type="email"
                                    required
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Reserve your subscription..."
                                    className="flex-1 bg-white/10 dark:bg-white/5 border-2 border-white/20 rounded-full px-10 py-5 text-white placeholder:text-white/40 focus:bg-white focus:text-primary outline-none font-bold transition-all"
                                />
                                <button type="submit" className="bg-white text-primary px-12 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all shadow-xl">
                                    Join Now
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
}
