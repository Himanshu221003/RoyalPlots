import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Predictor from '../components/Predictor';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PredictPrice() {
    return (
        <div className="bg-background text-on-surface min-h-screen pb-24 overflow-x-hidden">
            <Navbar />
            
            <main className="pt-28 sm:pt-36 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
                {/* Page Hero Header */}
                <motion.section 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        AI Verified Calculations
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-primary leading-none tracking-tighter">
                        ML Property Price <br />
                        <span className="text-accent">Estimator & Forecast</span>
                    </h1>
                    <p className="text-on-surface-variant text-sm sm:text-base font-semibold leading-relaxed">
                        Our intelligent regression models leverage actual property datasets, neighborhood multipliers, and price histories to deliver verified current valuations and 5-year CAGR projection graphs.
                    </p>
                </motion.section>

                {/* Form and Chart Widget */}
                <section className="animate-fade-in-up">
                    <Predictor />
                </section>
            </main>

            <BottomNav />
        </div>
    );
}
