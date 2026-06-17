import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, User, MapPin, Star, Award, ShieldCheck, 
    ChevronRight, Filter, Users2, Sparkles, MessageCircle,
    Phone, Mail
} from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

export default function Agents() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const [usersRes, propertiesRes] = await Promise.all([
                fetch(`${API_URL}/api/users`),
                fetch(`${API_URL}/api/properties`)
            ]);
            if (usersRes.ok && propertiesRes.ok) {
                const userData = await usersRes.json();
                const propData = await propertiesRes.json();
                
                const loadedAgents = userData.users.filter(u => u.role === 'agent' || u.email.includes('agent') || u.email === 'admin@royalplots.com');
                
                const agentsWithCount = loadedAgents.map(agent => {
                    const agentProperties = propData.properties.filter(p => {
                        const ownerId = p.owner?._id || p.owner;
                        return ownerId === agent._id || (p.location && p.location.includes(agent.location || 'NONE'));
                    });
                    return {
                        ...agent,
                        propertyCount: agentProperties.length
                    };
                });
                
                setAgents(agentsWithCount);
            }
        } catch (err) {
            console.error('Error fetching agents:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAgents = agents.filter(agent => 
        (agent.name || agent.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background dark:bg-dark-bg text-on-surface dark:text-dark-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-24 sm:pt-32 container-responsive space-y-20">
                {/* Hero Section */}
                <section className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-accent/10 dark:bg-accent/5 text-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm"
                    >
                        <Award className="w-4 h-4" />
                        Our Elite Partner Network
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-headline font-black text-6xl sm:text-8xl text-primary dark:text-dark-on-surface tracking-tighter leading-[0.9] uppercase italic"
                    >
                        Masters of <br />
                        <span className="text-accent">Acquisition</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-on-surface-variant dark:text-dark-on-surface-variant font-bold text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Connect with Central India's most distinguished consultants. These experts navigate the complexities of high-value real estate with unmatched precision and transparency.
                    </motion.p>
                </section>

                {/* Filter / Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto w-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-primary/10 dark:border-white/20 p-2.5 rounded-full shadow-2xl flex items-center gap-4"
                >
                    <div className="flex-1 flex items-center px-8">
                        <Search className="w-5 h-5 text-primary/60 dark:text-white/60 mr-4" />
                        <input 
                            type="text" 
                            placeholder="Consultant name or operational sector..."
                            className="bg-transparent border-none focus:ring-0 w-full text-sm font-bold text-primary dark:text-white placeholder:text-primary/45 dark:placeholder:text-white/40 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-primary dark:bg-accent text-white p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
                        <Filter className="w-5 h-5" />
                    </button>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/5] bg-surface-variant/20 animate-pulse rounded-[4rem]" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredAgents.map((agent, i) => (
                            <motion.div 
                                key={agent._id}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => navigate(`/agent/${agent._id}`)}
                                className="group relative bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[4rem] p-12 flex flex-col items-center text-center space-y-8 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 cursor-pointer overflow-hidden group/card"
                            >
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative">
                                    <div className="w-36 h-36 rounded-[3rem] border-8 border-primary/5 dark:border-dark-primary/5 p-1 overflow-hidden shadow-2xl bg-white dark:bg-dark-surface group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                                        <img src={agent.profileImage || `https://ui-avatars.com/api/?name=${agent.fullName || agent.name}&background=random&size=200`} className="w-full h-full object-cover rounded-[2.2rem]" alt="" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-accent text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white dark:border-dark-surface shadow-xl">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="space-y-3 flex flex-col items-center">
                                    <h3 className="font-headline font-black text-3xl text-primary dark:text-dark-on-surface leading-tight group-hover:text-accent transition-colors">{agent.fullName || agent.name}</h3>
                                    
                                    <div className="flex items-center gap-1.5 text-accent text-[10px] font-black uppercase tracking-wider">
                                        <MapPin className="w-3.5 h-3.5 text-accent" />
                                        {agent.location || 'Roorkee, Uttarakhand'}
                                    </div>

                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/30 dark:text-dark-on-surface-variant/40 flex items-center justify-center gap-2">
                                        <Sparkles className="w-3 h-3 text-accent" />
                                        Certified Strategic Associate
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 w-full gap-8 py-6 border-y border-surface-variant/50 dark:border-dark-surface-variant/50">
                                     <div className="space-y-1">
                                         <p className="font-black text-primary dark:text-white text-3xl tracking-tighter">{agent.experience || 8}+</p>
                                         <p className="text-[8px] font-black uppercase text-primary/40 dark:text-dark-on-surface-variant/40 tracking-widest">Experience</p>
                                     </div>
                                     <div className="space-y-1 border-l border-surface-variant/50 dark:border-dark-surface-variant/50">
                                         <p className="font-black text-primary dark:text-white text-3xl tracking-tighter">{agent.propertyCount || 0}</p>
                                         <p className="text-[8px] font-black uppercase text-primary/40 dark:text-dark-on-surface-variant/40 tracking-widest">Listings</p>
                                     </div>
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                     <a 
                                         href={`tel:${agent.phone || '9876543210'}`}
                                         onClick={(e) => e.stopPropagation()}
                                         className="flex-1 py-4 bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider transition-all border border-primary/5 dark:border-white/5"
                                     >
                                         <Phone className="w-4 h-4 text-accent" />
                                         Call
                                     </a>
                                     <a 
                                         href={`mailto:${agent.email}`}
                                         onClick={(e) => e.stopPropagation()}
                                         className="flex-1 py-4 bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider transition-all border border-primary/5 dark:border-white/5"
                                     >
                                         <Mail className="w-4 h-4 text-accent" />
                                         Email
                                     </a>
                                </div>

                                <button className="w-full py-5 bg-primary dark:bg-accent/10 dark:text-accent text-white rounded-3xl font-black uppercase tracking-widest text-[10px] group-hover:bg-accent group-hover:text-white transition-all shadow-xl shadow-primary/20 dark:shadow-none flex items-center justify-center gap-3">
                                    Consult Profile
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>

                                {/* Decorative Background Icon */}
                                <Users2 className="absolute -right-12 -bottom-12 text-primary/[0.03] dark:text-white/[0.03] w-64 h-64 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Network Stats */}
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-primary p-16 sm:p-24 rounded-[5rem] text-center space-y-12 relative overflow-hidden"
                >
                    <div className="relative z-10 space-y-6">
                        <h2 className="font-headline font-black text-4xl sm:text-6xl text-white tracking-tighter leading-none italic">Join the Elite <br /> <span className="text-accent underline decoration-white/20">Circle</span></h2>
                        <p className="text-white/60 font-bold text-lg max-w-xl mx-auto">Are you a distinguished real estate professional? Join RoyalPlots to elevate your portfolio to Central India's most discerning investors.</p>
                        <button className="bg-white text-primary px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all shadow-2xl">Partner with Us</button>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 blur-[100px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-10 blur-[100px] -ml-48 -mb-48" />
                </motion.section>
            </main>

            <BottomNav />
        </div>
    );
}
