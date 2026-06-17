import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { label: 'Home', icon: 'home', path: '/home' },
        { label: 'Search', icon: 'search', path: '/properties' },
        { label: 'List', icon: 'add_home', path: '/add-property', isMain: true },
        { label: 'Saved', icon: 'favorite', path: '/favorites' },
        { label: user?.email === 'admin@royalplots.com' ? 'Admin' : 'Profile', icon: user?.email === 'admin@royalplots.com' ? 'admin_panel_settings' : 'person', path: user?.email === 'admin@royalplots.com' ? '/admin' : '/dashboard' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full z-50 flex lg:hidden justify-around items-center bg-white/90 backdrop-blur-xl border-t border-surface-variant/50 shadow-[0_-8px_40px_rgba(0,30,60,0.08)] safe-bottom px-2 pt-2 pb-2">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                if (item.isMain) {
                    return (
                        <div key={item.label} className="relative flex justify-center" style={{ marginTop: '-1.75rem' }}>
                            <Link
                                to={item.path}
                                className="w-16 h-16 bg-secondary text-white rounded-[1.75rem] shadow-2xl shadow-secondary/40 flex flex-col items-center justify-center gap-0.5 border-4 border-white active:scale-90 transition-transform no-select"
                            >
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-80">{item.label}</span>
                            </Link>
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300 min-w-[56px] tap-target no-select ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                    >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 scale-110' : 'scale-100'}`}>
                            <span
                                className="material-symbols-outlined text-2xl"
                                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
