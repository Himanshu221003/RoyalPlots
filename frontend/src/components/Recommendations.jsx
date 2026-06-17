import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function Recommendations({ currentPropertyId, category }) {
    const [recommendations, setRecommendations] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
    }, [currentPropertyId, category, user]);

    const fetchRecommendations = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                const allProps = data.properties || [];

                // 1. Identify current property specs if on a details page
                const currentProp = allProps.find(p => p._id === currentPropertyId);
                const currentPrice = currentProp ? currentProp.price : null;

                // 2. Score properties based on personalization algorithm
                const scoredProps = allProps
                    .filter(p => p._id !== currentPropertyId && p.status === 'Approved')
                    .map(prop => {
                        let score = 0;

                        // Feature 1: Category Match (+40 points)
                        if (category && prop.category === category) {
                            score += 40;
                        }

                        // Feature 2: User Behavior Matching (if logged in)
                        if (user) {
                            // Analyze viewed properties history (limit to last 15)
                            const viewHistory = user.viewedProperties || [];
                            if (viewHistory.length > 0) {
                                const recentViews = viewHistory.slice(-15);
                                
                                // Find viewed categories
                                const categoriesCount = recentViews.reduce((acc, v) => {
                                    if (v.property) {
                                        const pObj = allProps.find(ap => ap._id === (v.property._id || v.property));
                                        if (pObj) acc[pObj.category] = (acc[pObj.category] || 0) + 1;
                                    }
                                    return acc;
                                }, {});
                                const favoriteCategory = Object.keys(categoriesCount).reduce((a, b) => categoriesCount[a] > categoriesCount[b] ? a : b, null);
                                if (favoriteCategory && prop.category === favoriteCategory) {
                                    score += 25;
                                }

                                // Find average viewed price
                                let totalPrice = 0;
                                let count = 0;
                                recentViews.forEach(v => {
                                    if (v.property) {
                                        const pObj = allProps.find(ap => ap._id === (v.property._id || v.property));
                                        if (pObj) {
                                            totalPrice += pObj.price;
                                            count++;
                                        }
                                    }
                                });
                                if (count > 0) {
                                    const avgPrice = totalPrice / count;
                                    const priceRatio = Math.min(prop.price, avgPrice) / Math.max(prop.price, avgPrice);
                                    score += priceRatio * 30; // up to +30 points for matching user's budget range
                                }
                            }

                            // Analyze favorites
                            const userFavs = user.favorites || [];
                            if (userFavs.includes(prop._id)) {
                                score -= 50; // Don't recommend what's already favorited!
                            } else {
                                // If matches favorite properties categories/locations
                                const hasFavMatches = userFavs.some(favId => {
                                    const favProp = allProps.find(ap => ap._id === (favId._id || favId));
                                    return favProp && favProp.category === prop.category;
                                });
                                if (hasFavMatches) score += 15;
                            }
                        }

                        // Feature 3: Price Proximity (up to +20 points)
                        if (currentPrice) {
                            const diffRatio = Math.abs(prop.price - currentPrice) / currentPrice;
                            const proximity = Math.max(0, 1 - diffRatio);
                            score += proximity * 20;
                        }

                        // Feature 4: Small random noise for discovery (+1 to +5 points)
                        score += Math.random() * 5;

                        return { prop, score };
                    });

                // Sort by score and take the top 4
                const sorted = scoredProps
                    .sort((a, b) => b.score - a.score)
                    .map(item => item.prop)
                    .slice(0, 4);

                setRecommendations(sorted);
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
                        AI Recommendation Feed
                    </div>
                    <h2 className="font-headline font-black text-4xl text-primary dark:text-dark-on-surface tracking-tighter">
                        Recommended for <span className="text-accent">You</span>
                    </h2>
                </div>
                <button 
                    onClick={() => navigate('/properties')}
                    className="text-[10px] font-black uppercase tracking-widest text-primary/40 dark:text-dark-primary/40 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                    View All
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
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl bg-surface-variant dark:bg-dark-surface-variant">
                            <img 
                                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt={prop.title} 
                            />
                            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl">
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
