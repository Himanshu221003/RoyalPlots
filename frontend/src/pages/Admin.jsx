import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function Admin() {
    const navigate = useNavigate();
    const { authFetch, user: currentUser } = useAuth();
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'users'
    
    // Stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        pendingProperties: 0,
        approvedProperties: 0
    });

    useEffect(() => {
        if (currentUser?.email !== 'admin@royalplots.com') {
            navigate('/home');
            return;
        }
        fetchAllData();
    }, [currentUser]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [propRes, userRes] = await Promise.all([
                fetch(`${API_URL}/api/properties`),
                authFetch(`${API_URL}/api/users`)
            ]);

            if (propRes.ok) {
                const data = await propRes.json();
                setProperties(data.properties);
                setStats(prev => ({
                    ...prev,
                    totalProperties: data.properties.length,
                    pendingProperties: data.properties.filter(p => p.status === 'Pending').length,
                    approvedProperties: data.properties.filter(p => p.status === 'Approved').length
                }));
            }

            if (userRes.ok) {
                const data = await userRes.json();
                setUsers(data.users);
                setStats(prev => ({ ...prev, totalUsers: data.users.length }));
            }
        } catch (err) {
            console.error('Admin Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyAction = async (id, status) => {
        try {
            const res = await authFetch(`${API_URL}/api/properties/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchAllData();
        } catch (err) {
            console.error('Property Action Error:', err);
        }
    };

    const deleteProperty = async (id) => {
        if (!window.confirm('Erase this estate permanently?')) return;
        try {
            const res = await authFetch(`${API_URL}/api/properties/${id}`, { method: 'DELETE' });
            if (res.ok) fetchAllData();
        } catch (err) {
            console.error('Delete Property Error:', err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Ban this user permanently?')) return;
        try {
            const res = await authFetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) fetchAllData();
        } catch (err) {
            console.error('Delete User Error:', err);
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-20 sm:pt-32 container-responsive space-y-12">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <h1 className="font-headline font-black text-4xl sm:text-6xl text-primary tracking-tighter">Command Center</h1>
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 leading-none">System Live & Secure</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setActiveTab('properties')}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'properties' ? 'bg-primary text-white shadow-xl' : 'bg-white text-primary border border-surface-variant'}`}
                        >
                            Estate Queue
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-xl' : 'bg-white text-primary border border-surface-variant'}`}
                        >
                            Member Directory
                        </button>
                    </div>
                </section>

                {/* Statistics Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Cloud Users', value: stats.totalUsers, icon: 'groups', color: 'bg-primary text-white' },
                        { label: 'Total Catalog', value: stats.totalProperties, icon: 'apartment', color: 'bg-white text-primary' },
                        { label: 'Pending Review', value: stats.pendingProperties, icon: 'history_edu', color: 'bg-secondary text-white' },
                        { label: 'Live Estates', value: stats.approvedProperties, icon: 'verified', color: 'bg-white text-primary' }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} p-8 rounded-[3rem] shadow-xl relative overflow-hidden group`}>
                            <div className="relative z-10 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                            </div>
                            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[10rem] opacity-5 group-hover:scale-110 transition-transform duration-700">{stat.icon}</span>
                        </div>
                    ))}
                </section>

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-8 border-primary/5 border-t-primary rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Syncing Data Streams...</span>
                    </div>
                ) : activeTab === 'properties' ? (
                    <section className="space-y-8 animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-surface-variant pb-6">
                            <h2 className="font-headline font-black text-3xl text-primary tracking-tight">Appraisal Queue</h2>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">{stats.pendingProperties} pending actions</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {properties.map((prop) => (
                                <div key={prop._id} className="bg-white border border-surface-variant rounded-[3rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 hover:shadow-2xl transition-all group">
                                    <div className="w-full lg:w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-lg shrink-0">
                                        <img 
                                            src={prop.images?.[0] || prop.coverImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                            alt="" 
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4 text-center lg:text-left min-w-0">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                                <h3 className="font-headline font-black text-2xl text-primary truncate">{prop.title}</h3>
                                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${prop.status === 'Approved' ? 'bg-secondary/10 text-secondary' : 'bg-primary/5 text-primary'}`}>{prop.status}</span>
                                            </div>
                                            <p className="text-on-surface-variant font-bold text-sm flex items-center justify-center lg:justify-start gap-2">
                                                <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                                                {prop.location}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                            <span>{prop.bedrooms || 3} BD</span>
                                            <span>{prop.bathrooms || 2} BT</span>
                                            <span>{prop.area || '2400'} SQFT</span>
                                            <span className="text-primary">₹ {prop.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-3 shrink-0">
                                        {prop.status === 'Pending' && (
                                            <button 
                                                onClick={() => handlePropertyAction(prop._id, 'Approved')}
                                                className="bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteProperty(prop._id)}
                                            className="bg-error/5 text-error px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-error hover:text-white transition-all shadow-lg shadow-error/5"
                                        >
                                            Delete
                                        </button>
                                        <Link 
                                            to={`/property/${prop._id}`} 
                                            className="bg-white border border-surface-variant text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary transition-all"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="space-y-8 animate-fade-in-up">
                         <div className="flex justify-between items-end border-b border-surface-variant pb-6">
                            <h2 className="font-headline font-black text-2xl sm:text-3xl text-primary tracking-tight">Member Directory</h2>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">{stats.totalUsers} identities</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {users.map((u) => (
                                <div key={u._id} className="bg-white border border-surface-variant rounded-[2.5rem] p-6 flex flex-col gap-4 hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={u.profileImage || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
                                            className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-primary/5 shrink-0"
                                            alt=""
                                        />
                                        <div className="min-w-0 flex-1">
                                            {u.role === 'agent' ? (
                                                <Link to={`/agent/${u._id}`} className="font-black text-primary truncate text-base hover:underline hover:text-secondary block">
                                                    {u.name} <span className="text-[8px] font-black uppercase tracking-widest text-accent">(Agent)</span>
                                                </Link>
                                            ) : (
                                                <p className="font-black text-primary truncate text-base">{u.name}</p>
                                            )}
                                            <p className="text-xs font-bold text-on-surface-variant opacity-60 truncate">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-surface-variant">
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] ${u.provider === 'google' ? 'bg-secondary/10 text-secondary' : 'bg-primary/5 text-primary/50'}`}>
                                            {u.provider === 'google' ? 'Google' : 'Email'}
                                        </span>
                                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{u.gender || '—'}</span>
                                        {u.email !== 'admin@royalplots.com' && (
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="w-9 h-9 rounded-xl bg-error/5 text-error opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-white flex items-center justify-center tap-target"
                                                title="Remove user"
                                            >
                                                <span className="material-symbols-outlined text-base">person_off</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
