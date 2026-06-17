import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import API_URL from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Shield, LayoutDashboard, LogOut, Building2, Users2, Info, Mail, Home, ChevronRight, User, Bell, TrendingUp } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, user, profileImage, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        if (!token) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${API_URL}/api/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotifications();

        if (socket) {
            if (user?._id) {
                socket.emit('join', user._id);
            }

            const handleNewProperty = (notif) => {
                setNotifications(prev => [notif, ...prev]);
            };

            const handlePriceDrop = (notif) => {
                setNotifications(prev => [notif, ...prev]);
            };

            const handleInquiry = (notif) => {
                setNotifications(prev => [notif, ...prev]);
            };

            socket.on('new_property', handleNewProperty);
            socket.on('price_drop', handlePriceDrop);
            socket.on('inquiry', handleInquiry);

            return () => {
                socket.off('new_property', handleNewProperty);
                socket.off('price_drop', handlePriceDrop);
                socket.off('inquiry', handleInquiry);
            };
        }
    }, [token, socket, user?._id]);

    // Re-mapping icons for lucide
    const navItems = [
        { name: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
        { name: 'Properties', path: '/properties', icon: <Building2 className="w-5 h-5" /> },
        { name: 'Predict Valuation', path: '/predict-price', icon: <TrendingUp className="w-5 h-5" /> },
        { name: 'Agents', path: '/agents', icon: <Users2 className="w-5 h-5" /> },
        { name: 'About', path: '/about', icon: <Info className="w-5 h-5" /> },
        { name: 'Contact', path: '/contact', icon: <Mail className="w-5 h-5" /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass dark:glass-dark shadow-2xl py-3' : 'bg-transparent py-5'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
                    {/* Logo */}
                    <div 
                        className="flex items-center gap-3 group cursor-pointer no-select" 
                        onClick={() => navigate('/home')}
                    >
                        <motion.div 
                            whileHover={{ rotate: 0, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 sm:w-12 sm:h-12 bg-primary dark:bg-dark-primary rounded-2xl flex items-center justify-center rotate-3 transition-colors shadow-lg shadow-primary/30"
                        >
                            <Home className="text-white w-6 h-6" />
                        </motion.div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-xl sm:text-2xl text-primary dark:text-dark-on-surface tracking-tighter">RoyalPlots</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 dark:text-dark-on-surface-variant hidden sm:block">Premium Real Estate</span>
                        </div>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-1 bg-surface/50 dark:bg-dark-surface/50 backdrop-blur-md p-1.5 rounded-2xl border border-surface-variant/20 dark:border-dark-surface-variant/20">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all relative group flex items-center gap-2 ${isActive(item.path) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary hover:bg-primary/5 dark:hover:bg-dark-primary/5'}`}
                            >
                                {item.name}
                                {isActive(item.path) && (
                                    <motion.span 
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-primary dark:bg-dark-primary rounded-xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-surface dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant text-primary dark:text-dark-primary shadow-sm"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.button>

                        {/* Notification Bell */}
                        {token && (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setIsNotifOpen(!isNotifOpen);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-surface dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant text-primary dark:text-dark-primary shadow-sm relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-dark-surface animate-pulse" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2rem] shadow-2xl z-50 overflow-hidden py-4"
                                            >
                                                <div className="px-6 pb-3 border-b border-surface-variant/40 dark:border-dark-surface-variant/40 flex justify-between items-center">
                                                    <h4 className="font-black text-sm text-primary dark:text-dark-on-surface uppercase tracking-widest">Notifications</h4>
                                                    {notifications.filter(n => !n.read).length > 0 && (
                                                        <button 
                                                            onClick={async () => {
                                                                const unread = notifications.filter(n => !n.read);
                                                                for (const notif of unread) {
                                                                    await fetch(`${API_URL}/api/notifications/${notif._id}/read`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                                    });
                                                                }
                                                                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                            }}
                                                            className="text-[9px] font-black uppercase tracking-wider text-accent hover:underline"
                                                        >
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="max-h-[300px] overflow-y-auto divide-y divide-surface-variant/20 dark:divide-dark-surface-variant/20">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-6 py-8 text-center text-xs font-bold text-on-surface-variant/40 dark:text-dark-on-surface-variant/40 uppercase tracking-widest">
                                                            No notifications yet
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div 
                                                                key={notif._id || Math.random()} 
                                                                onClick={async () => {
                                                                    if (!notif.read) {
                                                                        await fetch(`${API_URL}/api/notifications/${notif._id}/read`, {
                                                                            method: 'PUT',
                                                                            headers: { 'Authorization': `Bearer ${token}` }
                                                                        });
                                                                        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
                                                                    }
                                                                    setIsNotifOpen(false);
                                                                    if (notif.propertyId) {
                                                                        navigate(`/property/${notif.propertyId}`);
                                                                    }
                                                                }}
                                                                className={`px-6 py-4 cursor-pointer hover:bg-primary/5 dark:hover:bg-dark-primary/5 transition-colors flex flex-col gap-1 ${!notif.read ? 'bg-primary/5 dark:bg-dark-primary/5 border-l-4 border-accent' : ''}`}
                                                            >
                                                                <span className="text-xs font-black text-primary dark:text-white uppercase tracking-wider">{notif.title}</span>
                                                                <span className="text-[11px] font-bold text-on-surface-variant/70 dark:text-dark-on-surface-variant/70 leading-normal">{notif.message}</span>
                                                                <span className="text-[9px] font-medium text-on-surface-variant/40 dark:text-dark-on-surface-variant/40 mt-1">{new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {token ? (
                            <div className="flex items-center gap-3">
                                {/* User Profile */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate('/dashboard')}
                                    className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-full cursor-pointer hover:shadow-lg transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 dark:border-dark-primary/40 overflow-hidden bg-primary/5">
                                        {profileImage ? <img alt="Profile" src={profileImage} className="w-full h-full object-cover" /> : <User className="w-full h-full p-1.5 text-primary" />}
                                    </div>
                                    <span className="text-sm font-black text-primary dark:text-dark-on-surface truncate max-w-[100px]">{user?.name?.split(' ')[0] || 'Me'}</span>
                                </motion.div>

                                {/* Admin shortcut */}
                                {user?.email === 'admin@royalplots.com' && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/admin')}
                                        className="hidden md:flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Admin
                                    </motion.button>
                                )}
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="bg-primary dark:bg-dark-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-black transition-all shadow-xl shadow-primary/20"
                            >
                                Get Started
                            </motion.button>
                        )}

                        {/* Hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-primary dark:text-dark-primary bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-2xl shadow-sm"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Fullscreen Overlay Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] lg:hidden"
                    >
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ backdropFilter: "blur(0px)" }}
                            animate={{ backdropFilter: "blur(12px)" }}
                            className="absolute inset-0 bg-primary/20 dark:bg-dark-bg/60" 
                            onClick={() => setIsMenuOpen(false)} 
                        />
                        
                        {/* Drawer */}
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-dark-surface shadow-2xl flex flex-col pt-8"
                        >
                            {/* Drawer Header */}
                            <div className="flex justify-between items-center px-8 pb-6 border-b border-surface-variant dark:border-dark-surface-variant">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary dark:bg-dark-primary rounded-xl flex items-center justify-center">
                                        <Home className="text-white w-5 h-5" />
                                    </div>
                                    <span className="font-black text-xl text-primary dark:text-dark-on-surface tracking-tighter">RoyalPlots</span>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center text-primary/40 dark:text-dark-on-surface-variant bg-surface-variant/20 dark:bg-dark-surface-variant/20 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Info */}
                            {token && (
                                <div className="px-8 py-6 flex items-center gap-4 bg-primary/5 dark:bg-dark-primary/5 border-b border-surface-variant dark:border-dark-surface-variant">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 dark:border-dark-primary/40 bg-white">
                                        {profileImage ? <img src={profileImage} alt="" className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-primary" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-primary dark:text-dark-on-surface text-lg truncate">{user?.name}</p>
                                        <p className="text-xs font-bold text-primary/40 dark:text-dark-on-surface-variant truncate">{user?.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Nav Links */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-base font-black transition-all ${isActive(item.path) ? 'bg-primary dark:bg-dark-primary text-white shadow-lg shadow-primary/20' : 'text-primary dark:text-dark-on-surface-variant hover:bg-primary/5 dark:hover:bg-dark-primary/5'}`}
                                    >
                                        {item.icon}
                                        {item.name}
                                        {!isActive(item.path) && <ChevronRight className="ml-auto w-4 h-4 opacity-20" />}
                                    </Link>
                                ))}
                            </div>

                            {/* Drawer Footer */}
                            <div className="px-6 py-6 border-t border-surface-variant dark:border-dark-surface-variant space-y-3 safe-bottom">
                                {token ? (
                                    <>
                                        <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 bg-secondary/5 dark:bg-dark-secondary/5 rounded-2xl text-secondary dark:text-dark-secondary font-black transition-all hover:bg-secondary hover:text-white">
                                            <LayoutDashboard className="w-5 h-5" />
                                            My Dashboard
                                        </button>
                                        <button onClick={() => { logout(); navigate('/login'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 bg-error/5 rounded-2xl text-error font-black transition-all hover:bg-error hover:text-white">
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full py-5 bg-primary dark:bg-dark-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                                        Let's Explore
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
