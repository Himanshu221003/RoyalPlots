import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Vikram Singh",
        role: "Real Estate Investor",
        text: "RoyalPlots has redefined how I search for premium properties. The platform's attention to detail and curated listings are unparalleled in Central India.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Ananya Sharma",
        role: "Homeowner",
        text: "The virtual walkthrough feature saved me so much time. Finding my dream home was a seamless and actually enjoyable process thanks to RoyalPlots.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Rahul Mehta",
        role: "Commercial Developer",
        text: "A professional and efficient service. The data-driven insights provided by the RoyalPlots team were crucial for our latest project acquisition.",
        rating: 4,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop"
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="bg-primary dark:bg-dark-surface py-24 sm:py-32 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <Quote className="text-white w-[500px] h-[500px] absolute -top-20 -left-20" />
            </div>

            <div className="container-responsive relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                        Success Stories
                    </motion.div>
                    <h2 className="font-headline font-black text-4xl sm:text-7xl text-white tracking-tighter leading-tight">
                        Voice of our <br />
                        <span className="text-accent italic font-display">Elite Community</span>
                    </h2>
                    <div className="flex gap-4">
                        <button onClick={prev} className="w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={next} className="w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-dark-surface-variant p-8 sm:p-12 rounded-[3.5rem] shadow-2xl space-y-10"
                        >
                            <div className="flex gap-1 text-accent">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            
                            <p className="text-xl sm:text-2xl font-bold text-primary dark:text-dark-on-surface leading-relaxed italic">
                                "{testimonials[currentIndex].text}"
                            </p>

                            <div className="flex items-center gap-6 pt-4 border-t border-surface-variant dark:border-dark-surface-variant/20">
                                <img 
                                    src={testimonials[currentIndex].image} 
                                    className="w-16 h-16 rounded-2xl object-cover shadow-lg" 
                                    alt={testimonials[currentIndex].name} 
                                />
                                <div>
                                    <h4 className="font-black text-primary dark:text-dark-on-surface text-xl">{testimonials[currentIndex].name}</h4>
                                    <p className="text-xs font-black uppercase tracking-widest text-primary/40 dark:text-dark-on-surface-variant">{testimonials[currentIndex].role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
