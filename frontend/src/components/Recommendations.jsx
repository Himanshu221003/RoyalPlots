import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

export default function Recommendations({ currentPropertyId, category }) {
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
    }, [currentPropertyId]);

    const fetchRecommendations = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                // Simple recommendation logic: same category, different ID
                const filtered = data.properties
                    .filter(p => p._id !== currentPropertyId && p.category === category && p.status === 'Approved')
                    .slice(0, 4);
                setRecommendations(filtered);
            }
        } catch (err) {
            console.error("Failed to fetch recommendations", err);
        }
    };

    if (recommendations.length === 0) return null;

    return (
        <section className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        AI Personalization
                    </div>
                    <h2 className="font-headline font-black text-4xl text-primary dark:text-dark-on-surface tracking-tighter">
                        Recommended for <span className="text-secondary opacity-20">You</span>
                    </h2>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-dark-primary/40 hover:text-primary transition-colors flex items-center gap-2 group">
                    View Portfolio
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendations.map((prop, i) => (
                    <motion.div
                        key={prop._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => {
                            navigate(`/property/${prop._id}`);
                            window.scrollTo(0, 0);
                        }}
                        className="group cursor-pointer space-y-4"
                    >
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl">
                            <img src={prop.images?.[0] || prop.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl">
                                <span className="text-[10px] font-black text-white">₹ {prop.price?.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="px-2">
                            <h4 className="font-black text-primary dark:text-dark-on-surface truncate group-hover:text-accent transition-colors">{prop.title}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 dark:text-dark-on-surface-variant/40">{prop.location}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
