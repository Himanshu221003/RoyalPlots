import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, Award, ShieldCheck, 
    Globe, ArrowLeft, Star, 
    CheckCircle, TrendingUp, Building2, Briefcase
} from 'lucide-react';
import { SkeletonProfile } from '../components/Skeleton';

export default function AgentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { darkMode } = useTheme();
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgentData();
    }, [id]);

    const fetchAgentData = async () => {
        try {
            const userRes = await fetch(`${API_URL}/api/users`);
            if (userRes.ok) {
                const userData = await userRes.json();
                const foundAgent = userData.users.find(u => u._id === id);
                if (foundAgent) {
                    setAgent(foundAgent);
                    const propRes = await fetch(`${API_URL}/api/properties`);
                    if (propRes.ok) {
                        const propData = await propRes.json();
                        setProperties(propData.properties.filter(p => {
                            const ownerId = p.owner?._id || p.owner;
                            return ownerId === id || (p.location && p.location.includes(foundAgent.location || ''));
                        }));
                    }
                } else {
                    navigate('/home');
                }
            }
        } catch (err) {
            console.error('Agent Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    if (!agent) return null;

    return (
        <div className="bg-background dark:bg-dark-bg text-on-surface dark:text-dark-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-24 sm:pt-32 container-responsive">
                {/* Header Section */}
                <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] text-primary/40 dark:text-dark-on-surface-variant mb-12 group"
                >
                    <div className="w-10 h-10 rounded-full border border-surface-variant dark:border-dark-surface-variant flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-dark-primary group-hover:text-white transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    Partner Directory
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Identity Card */}
                    <aside className="lg:col-span-4 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[4rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-accent via-primary to-accent" />
                            
                            <div className="relative mx-auto w-fit">
                                <div className="w-52 h-52 rounded-[3.5rem] border-8 border-primary/5 dark:border-dark-primary/5 p-2 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                                    <img src={agent.profileImage || `https://ui-avatars.com/api/?name=${agent.fullName || agent.name}&background=random&size=200`} className="w-full h-full object-cover rounded-[3rem]" alt="" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-accent text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border-4 border-white dark:border-dark-surface">
                                    Top 1%
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="font-headline font-black text-4xl text-primary dark:text-dark-on-surface tracking-tighter">{agent.fullName || agent.name}</h1>
                                <p className="text-accent font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <Award className="w-4 h-4" />
                                    Elite Strategy Partner
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                { [
                                    { label: 'LI', link: '#', color: 'bg-primary/5 text-primary' },
                                    { label: 'TW', link: '#', color: 'bg-accent/5 text-accent' },
                                    { icon: Globe, link: '#', color: 'bg-primary/5 text-primary' }
                                ].map((social, i) => (
                                    <a key={i} href={social.link} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:scale-110 ${social.color}`}>
                                        {social.icon ? (
                                            <social.icon className="w-6 h-6" />
                                        ) : (
                                            <span className="text-[10px] font-black">{social.label}</span>
                                        )}
                                    </a>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-surface-variant/50 dark:border-dark-surface-variant/50 grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-3xl font-black text-primary dark:text-dark-on-surface">{agent.experience || 8}+</p>
                                    <p className="text-[8px] font-black uppercase text-primary/40 dark:text-dark-on-surface-variant/40 tracking-widest">Years Depth</p>
                                </div>
                                <div className="space-y-1 border-l border-surface-variant/50 dark:border-dark-surface-variant/50">
                                    <p className="text-3xl font-black text-primary dark:text-dark-on-surface">{properties.length}</p>
                                    <p className="text-[8px] font-black uppercase text-primary/40 dark:text-dark-on-surface-variant/40 tracking-widest">Active Portfolios</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-primary dark:bg-dark-surface p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group"
                        >
                             <div className="relative z-10 space-y-8">
                                 <h3 className="font-headline font-black text-2xl flex items-center gap-3">
                                    <ShieldCheck className="w-6 h-6 text-accent" />
                                    Expertise Hub
                                 </h3>
                                 <ul className="space-y-6">
                                     {[
                                        { label: 'Asset Management', icon: Briefcase },
                                        { label: 'Market Valuation', icon: TrendingUp },
                                        { label: 'Heritage Assets', icon: Building2 },
                                        { label: 'Luxury Leasing', icon: Star }
                                     ].map((skill, i) => (
                                         <li key={i} className="flex items-center gap-4 text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">
                                             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <skill.icon className="w-5 h-5 text-accent" />
                                             </div>
                                             {skill.label}
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                        </motion.div>
                    </aside>

                    {/* Right: Portfolio Content */}
                    <div className="lg:col-span-8 space-y-20">
                        <motion.section 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-10"
                        >
                             <div className="flex items-end gap-6 border-b border-surface-variant dark:border-dark-surface-variant pb-8">
                                <h2 className="font-headline font-black text-6xl text-primary dark:text-dark-on-surface tracking-tighter uppercase italic">Persona</h2>
                                <span className="text-accent font-black text-[10px] uppercase tracking-[0.3em] mb-2">Strategy Consultant</span>
                             </div>
                             <p className="text-2xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed opacity-80 italic">
                                 {agent.about || `${agent.fullName || agent.name} acts as a cornerstone of the RoyalPlots network, orchestrating high-value residential and commercial acquisitions. With a refined focus on portfolio growth and data-driven insights, they navigate the complexities of Central India's real estate market with surgical precision and absolute transparency.`}
                             </p>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                 <a 
                                    href={`tel:${agent.phone || '9876543210'}`}
                                    className="flex items-center justify-center gap-4 bg-primary dark:bg-accent text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-secondary dark:hover:bg-white dark:hover:text-primary transition-all shadow-2xl"
                                 >
                                    <Phone className="w-5 h-5" />
                                    Secure Line
                                 </a>
                                 <a 
                                    href={`mailto:${agent.email || 'contact@aditya.property@gmail.com'}`}
                                    className="flex items-center justify-center gap-4 bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant text-primary dark:text-dark-on-surface py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:border-primary transition-all"
                                 >
                                    <Mail className="w-5 h-5" />
                                    Transmission
                                 </a>
                             </div>
                        </motion.section>

                        <motion.section 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-12"
                        >
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <h2 className="font-headline font-black text-4xl text-primary dark:text-dark-on-surface tracking-tight">Active Portfolio</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        {properties.length} Exclusive Listings
                                    </p>
                                </div>
                                <Link to="/properties" className="flex items-center gap-2 text-primary/40 dark:text-dark-on-surface-variant/40 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors">
                                    Global Collection
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {properties.map((prop, i) => (
                                    <motion.div
                                        key={prop._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => navigate(`/property/${prop._id}`)}
                                        className="group cursor-pointer flex flex-col gap-8"
                                    >
                                        <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl bg-black/5 hover:-translate-y-4 transition-all duration-700">
                                            <img src={(prop.images && prop.images[0]) || prop.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                                            <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">₹ {prop.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 space-y-2">
                                            <h4 className="font-black text-primary dark:text-dark-on-surface text-2xl truncate group-hover:text-accent transition-colors">{prop.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-dark-on-surface-variant/40">
                                                <MapPin className="w-4 h-4 text-accent" />
                                                {prop.location}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
