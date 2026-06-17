import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function Favorites() {
    const navigate = useNavigate();
    const { user, toggleFavorite } = useAuth();
    const [savedProperties, setSavedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.favorites?.length > 0) {
            fetchSavedProperties();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchSavedProperties = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                const saved = data.properties.filter(p => user.favorites.includes(p._id));
                setSavedProperties(saved);
            }
        } catch (err) {
            console.error('Error fetching saved properties:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32 overflow-x-hidden">
            <Navbar />

            <main className="pt-20 sm:pt-32 container-responsive space-y-10">
                <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-surface-variant pb-8">
                    <div className="space-y-1">
                        <h1 className="font-headline font-black text-3xl sm:text-5xl text-primary tracking-tighter">My Collection</h1>
                        <p className="text-on-surface-variant font-bold text-xs sm:text-sm uppercase tracking-widest">Saved estates from your exploration</p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/5 px-6 py-3 rounded-2xl">
                        <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        <span className="text-primary font-black text-sm">{savedProperties.length} saved</span>
                    </div>
                </section>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-14 h-14 border-8 border-primary/5 border-t-primary rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Syncing Collection...</span>
                    </div>
                ) : savedProperties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 glass rounded-[3rem] px-8">
                        <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center">
                            <span className="material-symbols-outlined text-5xl text-primary/20">favorite_border</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-headline font-black text-2xl sm:text-3xl text-primary">Gallery is Empty</h3>
                            <p className="text-on-surface-variant font-bold max-w-xs mx-auto text-sm leading-relaxed">
                                Tap the heart icon on any property to save it here for quick access.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/properties')}
                            className="bg-primary text-white px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all hover:bg-secondary"
                        >
                            Start Exploring
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {savedProperties.map((prop) => (
                            <div key={prop._id} className="group relative bg-white rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border border-surface-variant hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div
                                    className="aspect-[16/10] overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/property/${prop._id}`)}
                                >
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        src={(prop.images && prop.images[0]) || prop.coverImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'}
                                        alt={prop.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                {/* Remove button */}
                                <button
                                    onClick={() => toggleFavorite(prop._id)}
                                    className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform tap-target z-10"
                                    title="Remove from saved"
                                >
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                                </button>

                                <div
                                    className="p-6 sm:p-8 space-y-3 cursor-pointer"
                                    onClick={() => navigate(`/property/${prop._id}`)}
                                >
                                    <h3 className="font-headline font-black text-xl sm:text-2xl text-primary leading-tight line-clamp-1 group-hover:text-secondary transition-colors">
                                        {prop.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-on-surface-variant font-bold text-xs">
                                        <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
                                        <span className="truncate">{prop.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-surface-variant">
                                        <span className="font-black text-secondary text-base">
                                            ₹ {typeof prop.price === 'number' ? prop.price.toLocaleString() : prop.price}
                                        </span>
                                        <div className="flex gap-4 text-[10px] font-black uppercase text-primary/40">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">bed</span>
                                                {prop.bedrooms || 3}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">bathtub</span>
                                                {prop.bathrooms || 2}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
