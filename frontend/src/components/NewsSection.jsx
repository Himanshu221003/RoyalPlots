import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, ArrowRight, Newspaper, ShieldAlert } from 'lucide-react';

const newsItems = [
    {
        id: 1,
        title: "The Rise of Luxury Condos in Central India",
        category: "Market Trends",
        date: "May 20, 2026",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
        excerpt: "Investors are increasingly looking towards integrated luxury complexes offering a mix of workspace and residential spaces."
    },
    {
        id: 2,
        title: "Interest Rates: What Homebuyers Should Know",
        category: "Finance",
        date: "May 18, 2026",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
        excerpt: "Current market analysis suggests a stable rate period, making it an ideal time for high-ticket property investments."
    },
    {
        id: 3,
        title: "Sustainability in Modern Architecture",
        category: "Design",
        date: "May 15, 2026",
        image: "https://images.unsplash.com/photo-1518005020251-58296d87ba67?w=800&auto=format&fit=crop",
        excerpt: "Eco-friendly materials and smart energy management are now top priorities for premium developers."
    }
];

export default function NewsSection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="container-responsive py-24 space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                        <Newspaper className="w-3 h-3" />
                        Insider Insights
                    </motion.div>
                    <h2 className="font-headline font-black text-4xl sm:text-6xl text-primary dark:text-dark-on-surface tracking-tighter">
                        Market <span className="text-accent italic font-display">Intelligence</span>
                    </h2>
                    <p className="text-on-surface-variant dark:text-dark-on-surface-variant font-bold max-w-xl">
                        Stay ahead of real estate dynamics with our curated selection of market trends, investment tips, and architectural breakthroughs.
                    </p>
                </div>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-3 font-black text-primary dark:text-dark-primary uppercase tracking-widest text-xs group"
                >
                    View Full Archive
                    <div className="w-10 h-10 rounded-full border border-primary/20 dark:border-dark-primary/20 flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-dark-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {newsItems.map((news, i) => (
                    <motion.article 
                        key={news.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col gap-6 cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-xl">
                            <img 
                                src={news.image} 
                                alt={news.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute top-6 left-6 bg-white dark:bg-dark-surface px-4 py-2 rounded-xl shadow-lg">
                                <span className="text-[10px] font-black text-primary dark:text-dark-primary uppercase tracking-widest">{news.category}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4 px-2">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 dark:text-dark-on-surface-variant/40">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {news.date}
                                </div>
                                <div className="flex items-center gap-2 text-accent">
                                    <TrendingUp className="w-3 h-3" />
                                    Hot Topic
                                </div>
                            </div>
                            <h3 className="font-headline font-black text-2xl text-primary dark:text-dark-on-surface group-hover:text-accent transition-colors leading-tight">
                                {news.title}
                            </h3>
                            <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-sm font-medium leading-relaxed line-clamp-2">
                                {news.excerpt}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Premium Intelligence Access Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-primary/20 dark:bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="bg-white dark:bg-dark-surface w-full max-w-md rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-12 text-center space-y-8 relative overflow-hidden"
                        >
                            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto scale-110">
                                <ShieldAlert className="w-10 h-10" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-primary dark:text-white tracking-tighter">Premium Access Only</h3>
                                <p className="text-xs font-bold text-on-surface-variant/80 dark:text-dark-on-surface-variant/80 leading-relaxed">
                                    The Market Intelligence archive is restricted to verified portfolio holders. Contact our support desk to upgrade your access credentials.
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-5 bg-primary dark:bg-accent text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-secondary dark:hover:bg-white dark:hover:text-primary transition-all shadow-xl"
                            >
                                Acknowledge & Return
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
