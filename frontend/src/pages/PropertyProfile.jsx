import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, Share2, MapPin, BedDouble, Bath, Square, 
    CheckCircle, Mail, Phone, ExternalLink, ShieldCheck, 
    ArrowLeft, ChevronRight, Sparkles, MessageCircle
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import ThreeDPreview from '../components/ThreeDPreview';
import Recommendations from '../components/Recommendations';
import { SkeletonProfile } from '../components/Skeleton';

export default function PropertyProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, toggleFavorite, authFetch } = useAuth();
    const { darkMode } = useTheme();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [activeView, setActiveView] = useState('GALLERY'); // GALLERY, 3D, MAP

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inquiryData, setInquiryData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchPropertyData();
        if (user) {
            setInquiryData(prev => ({
                ...prev,
                name: user.name || user.fullName || '',
                email: user.email || ''
            }));
        }
    }, [id, user]);

    const fetchPropertyData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                const found = data.properties.find(p => p._id === id);
                if (found) {
                    setProperty(found);
                } else {
                    navigate('/home');
                }
            }
        } catch (err) {
            console.error('Error fetching property:', err);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = user?.favorites?.includes(id);

    const handleSendInquiry = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await authFetch(`${API_URL}/api/inquiries`, {
                method: 'POST',
                body: JSON.stringify({
                    propertyId: id,
                    propertyName: property.title,
                    buyerName: inquiryData.name,
                    buyerEmail: inquiryData.email,
                    buyerPhone: inquiryData.phone,
                    message: inquiryData.message,
                    price: property.price
                })
            });

            if (res.ok) {
                setStatusMessage('Inquiry sent successfully!');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setStatusMessage('');
                }, 2000);
            }
        } catch (err) {
            setStatusMessage('Failed to send inquiry.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    if (!property) return null;

    const defaultAgent = {
        _id: "default-agent-1",
        name: "Agent Aditya",
        email: "contact@aditya.property@gmail.com",
        phone: "9876543210",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
        experience: 8,
        about: "Specializing in ultra-high-net-worth real estate acquisitions and custom architectural portfolios."
    };

    const agent = property.owner || defaultAgent;

    const allImages = property.images && property.images.length > 0 ? property.images : [property.coverImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'];

    return (
        <div className="bg-background dark:bg-dark-bg text-on-surface dark:text-dark-on-surface min-h-screen pb-32 overflow-x-hidden">
            <Navbar />

            <main className="pt-24 sm:pt-32 container-responsive">
                {/* Back Button & Actions */}
                <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] text-primary/40 dark:text-dark-on-surface-variant group">
                        <div className="w-10 h-10 rounded-full border border-surface-variant dark:border-dark-surface-variant flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-dark-primary group-hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Return to Portfolio
                    </button>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-2xl border border-surface-variant dark:border-dark-surface-variant flex items-center justify-center text-primary/40 dark:text-dark-on-surface-variant hover:bg-accent hover:text-white transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => toggleFavorite(id)}
                            className={`w-12 h-12 rounded-2xl border border-surface-variant dark:border-dark-surface-variant flex items-center justify-center transition-all ${isFavorite ? 'bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/20' : 'text-primary/40 dark:text-dark-on-surface-variant hover:text-red-500'}`}
                        >
                            <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Media Display Area */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Interactive Toggle */}
                        <div className="flex bg-white dark:bg-dark-surface p-2 rounded-3xl border border-surface-variant dark:border-dark-surface-variant shadow-xl w-fit">
                            {['GALLERY', '3D', 'MAP'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setActiveView(view)}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${activeView === view ? 'bg-primary dark:bg-accent text-white shadow-lg' : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary'}`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {activeView === 'GALLERY' && (
                                <motion.div 
                                    key="gallery"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    <div className="relative aspect-[16/10] rounded-[4rem] overflow-hidden shadow-2xl border border-surface-variant dark:border-dark-surface-variant">
                                        <img src={allImages[activeImage]} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute top-8 left-8 flex gap-3">
                                            <div className="glass dark:glass-dark px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-accent" />
                                                Verified Listing
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                                        {allImages.map((img, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setActiveImage(i)}
                                                className={`w-28 h-28 rounded-3xl overflow-hidden shrink-0 border-4 transition-all ${activeImage === i ? 'border-accent shadow-xl scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                            >
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            {activeView === '3D' && (
                                <motion.div 
                                    key="3d"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <ThreeDPreview imageUrl={allImages[0]} />
                                </motion.div>
                            )}
                            {activeView === 'MAP' && (
                                <motion.div 
                                    key="map"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <InteractiveMap location={property.location} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Description Section */}
                        <div className="space-y-8 pt-6">
                            <div className="flex items-center gap-4">
                                <h2 className="font-headline font-black text-3xl text-primary dark:text-dark-on-surface tracking-tight">Estate Narrative</h2>
                                <div className="h-px flex-1 bg-surface-variant dark:bg-dark-surface-variant" />
                            </div>
                            <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-xl leading-relaxed font-medium">
                                {property.description || "Experience unprecedented luxury in this masterfully designed estate. Every corner reflecting architectural finesse, this property is poised for those who seek the extraordinary. From sun-drenched living areas to tranquil private quarters, it represents the pinnacle of modern residency in Central India."}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="lg:col-span-4 space-y-12">
                        <section className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="font-headline font-black text-5xl text-primary dark:text-dark-on-surface leading-[1.1] tracking-tighter italic">{property.title}</h1>
                                <p className="text-on-surface-variant dark:text-dark-on-surface-variant font-bold text-lg flex items-center gap-3">
                                    <MapPin className="text-accent w-5 h-5" />
                                    {property.location}
                                </p>
                            </div>
                            <div className="bg-primary/5 dark:bg-dark-primary/5 p-8 rounded-[3rem] border border-primary/10 dark:border-dark-primary/10 flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-dark-on-surface-variant/40">Market Valuation</p>
                                    <h2 className="text-4xl font-black text-primary dark:text-dark-on-surface tracking-tighter">₹ {property.price.toLocaleString()}</h2>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-white dark:bg-dark-surface flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-accent" />
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-2 gap-6 mt-8">
                            {[
                                { label: 'Suites', val: property.bedrooms || 3, icon: BedDouble },
                                { label: 'Baths', val: property.bathrooms || 2, icon: Bath },
                                { label: 'Extent', val: `${property.area || '2,400'}`, icon: Square },
                                { label: 'Vibe', val: property.category || 'Luxury', icon: CheckCircle },
                            ].map((spec, i) => (
                                <div key={i} className="glass dark:glass-dark p-6 rounded-[2.5rem] flex flex-col items-center text-center gap-3 hover:ring-4 ring-accent/10 transition-all border border-white/30">
                                    <spec.icon className="w-6 h-6 text-accent" />
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-black text-primary dark:text-white leading-none">{spec.val}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-white/40">{spec.label}</p>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Listing Agent Block */}
                        <section className="bg-white/5 dark:bg-white/2 p-6 rounded-[2.5rem] border border-white/10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent">
                                    <img 
                                        src={agent.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"} 
                                        alt={agent.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">Listing Agent</p>
                                    <h4 className="font-headline font-black text-xl text-primary dark:text-white leading-tight">{agent.name}</h4>
                                    <p className="text-[9px] font-bold text-on-surface-variant/60 dark:text-dark-on-surface-variant/60">
                                        {agent.experience || 5}+ Years Experience
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-on-surface-variant/80 dark:text-dark-on-surface-variant/80 italic leading-relaxed">
                                "{agent.about || "Dedicated to finding your perfect sanctuary. Contact me for priority viewing or a custom proposal."}"
                            </p>
                            {agent._id && agent._id !== "default-agent-1" && (
                                <Link 
                                    to={`/agent/${agent._id}`}
                                    className="w-full py-3 bg-white/10 hover:bg-white/25 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center block transition-all border border-white/10 text-primary dark:text-white"
                                >
                                    Consult Representative Profile
                                </Link>
                            )}
                        </section>

                        <section className="space-y-4 pt-4">
                             <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-primary dark:bg-accent text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-secondary dark:hover:bg-white dark:hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-4 group"
                            >
                                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Initiate Inquiry
                             </button>
                             <div className="grid grid-cols-2 gap-4">
                                 <a 
                                    href={`https://wa.me/${agent.phone || '9876543210'}?text=Hi%20${encodeURIComponent(agent.name)},%20I%2527m%20interested%20in%20${encodeURIComponent(property.title)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-[#25D366] text-white py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-3 text-center"
                                 >
                                     <MessageCircle className="w-4 h-4" />
                                     Chat
                                 </a>
                                 <a 
                                    href={`tel:${agent.phone || '9876543210'}`}
                                    className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant text-primary dark:text-dark-on-surface py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:border-primary transition-all flex items-center justify-center gap-3 text-center"
                                 >
                                     <Phone className="w-4 h-4" />
                                     Recall
                                 </a>
                             </div>
                        </section>

                        {/* Social Proof / Security */}
                        <div className="bg-white/5 dark:bg-white/2 p-6 rounded-3xl border border-white/10 space-y-4">
                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-accent">
                                <ShieldCheck className="w-4 h-4" />
                                Security Guaranteed
                            </div>
                            <p className="text-[10px] text-on-surface-variant/60 dark:text-dark-on-surface-variant/40 font-bold leading-relaxed">
                                All transactions are protected via our internal escrow system. Estate verified by the Central Intelligence Unit of RoyalPlots.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="mt-32">
                    <Recommendations currentPropertyId={id} category={property.category} />
                </div>
            </main>

            <BottomNav />

            {/* Premium Inquiry Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-primary/20 dark:bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="bg-white dark:bg-dark-surface w-full max-w-xl rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-12 space-y-10 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-primary dark:text-white tracking-tighter">Priority Dossier</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        Personalized Consultation
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-variant/20 transition-all">
                                    <ArrowLeft className="w-6 h-6 text-primary dark:text-white" />
                                </button>
                            </div>

                            {statusMessage ? (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto scale-110">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <p className="font-black text-primary dark:text-white text-2xl tracking-tight uppercase">{statusMessage}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSendInquiry} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 dark:text-white/40 px-2">Identifier</label>
                                            <input 
                                                className="w-full px-8 py-5 bg-surface-variant/20 dark:bg-dark-surface-variant/20 border-none rounded-3xl focus:ring-2 ring-primary dark:ring-accent font-bold text-primary dark:text-white outline-none transition-all placeholder:text-primary/20" 
                                                value={inquiryData.name}
                                                onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                                                placeholder="Your Full Name"
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 dark:text-white/40 px-2">Contact Line</label>
                                            <input 
                                                className="w-full px-8 py-5 bg-surface-variant/20 dark:bg-dark-surface-variant/20 border-none rounded-3xl focus:ring-2 ring-primary dark:ring-accent font-bold text-primary dark:text-white outline-none transition-all placeholder:text-primary/20" 
                                                value={inquiryData.phone}
                                                onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                                                placeholder="+91..."
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 dark:text-white/40 px-2">Briefing</label>
                                        <textarea 
                                            className="w-full px-8 py-5 bg-surface-variant/20 dark:bg-dark-surface-variant/20 border-none rounded-[2.5rem] focus:ring-2 ring-primary dark:ring-accent font-bold text-primary dark:text-white outline-none h-40 resize-none transition-all placeholder:text-primary/20" 
                                            placeholder="Indicate your preferred viewing schedule..."
                                            value={inquiryData.message}
                                            onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button 
                                        className="w-full py-6 bg-primary dark:bg-accent text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-secondary dark:hover:bg-white dark:hover:text-primary transition-all shadow-3xl active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Syncing Dossier...' : 'Transmit Inquiry'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
