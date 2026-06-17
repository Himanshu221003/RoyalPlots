import { motion } from 'framer-motion';

export const Shimmer = () => (
    <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
    />
);

export const SkeletonCard = () => (
    <div className="space-y-6">
        <div className="relative aspect-[4/3] rounded-[3rem] bg-surface-variant/20 dark:bg-dark-surface-variant/20 overflow-hidden">
            <Shimmer />
        </div>
        <div className="space-y-3 px-4">
            <div className="h-8 w-3/4 rounded-xl bg-surface-variant/20 dark:bg-dark-surface-variant/20 relative overflow-hidden">
                <Shimmer />
            </div>
            <div className="h-4 w-1/2 rounded-lg bg-surface-variant/20 dark:bg-dark-surface-variant/20 relative overflow-hidden">
                <Shimmer />
            </div>
            <div className="flex gap-4 pt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-12 rounded-lg bg-surface-variant/20 dark:bg-dark-surface-variant/20 relative overflow-hidden">
                        <Shimmer />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const SkeletonProfile = () => (
    <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant relative overflow-hidden">
        <div className="w-20 h-20 rounded-[2rem] bg-surface-variant/20 dark:bg-dark-surface-variant/20 relative overflow-hidden">
            <Shimmer />
        </div>
        <div className="space-y-2 flex-1">
            <div className="h-6 w-1/3 rounded-lg bg-surface-variant/20 dark:bg-dark-surface-variant/20 relative overflow-hidden">
                <Shimmer />
            </div>
            <div className="h-4 w-1/2 rounded-lg bg-surface-variant/20 dark:bg-dark-surface-variant/20 relative overflow-hidden">
                <Shimmer />
            </div>
        </div>
    </div>
);

export const LoadingPage = () => (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center flex-col gap-6">
        <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40"
        >
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 dark:text-dark-primary/40 animate-pulse">Initializing Premium Experience</span>
    </div>
);
