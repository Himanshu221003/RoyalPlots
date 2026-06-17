import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { BarChart3, Users, Building, FileText, CheckCircle, Eye, Trash2, ShieldAlert } from 'lucide-react';

export default function Admin() {
    const navigate = useNavigate();
    const { authFetch, user: currentUser } = useAuth();
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'users' | 'analytics'
    
    // Stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        pendingProperties: 0,
        approvedProperties: 0
    });

    useEffect(() => {
        if (currentUser?.email !== 'himanshumandal799@gmail.com') {
            navigate('/home');
            return;
        }
        fetchAllData();
    }, [currentUser]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [propRes, userRes, analyticsRes] = await Promise.all([
                fetch(`${API_URL}/api/properties`),
                authFetch(`${API_URL}/api/users`),
                authFetch(`${API_URL}/api/analytics/dashboard`)
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

            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setAnalytics(data);
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

    // Chart helpers
    const getLineChartPoints = (trend) => {
        if (!trend || trend.length === 0) return '';
        const paddingX = 40;
        const paddingY = 30;
        const width = 450;
        const height = 180;

        const maxVal = Math.max(...trend.map(t => t.users || t.inquiries || 1));
        const minVal = Math.min(...trend.map(t => t.users || t.inquiries || 0));
        const range = maxVal - minVal || 1;

        return trend.map((t, idx) => {
            const val = t.users !== undefined ? t.users : t.inquiries;
            const x = paddingX + (idx * (width - paddingX * 2) / (trend.length - 1));
            const y = height - paddingY - ((val - minVal) * (height - paddingY * 2) / range);
            return `${x},${y}`;
        }).join(' ');
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-24 sm:pt-36 container-responsive space-y-12">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <h1 className="font-headline font-black text-4xl sm:text-6xl text-primary tracking-tighter">Command Center</h1>
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 leading-none">System Live & Secure</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={() => setActiveTab('properties')}
                            className={`px-6 sm:px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'properties' ? 'bg-primary text-white shadow-xl' : 'bg-white dark:bg-dark-surface text-primary border border-surface-variant dark:border-dark-surface-variant'}`}
                        >
                            Estate Queue
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-6 sm:px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-xl' : 'bg-white dark:bg-dark-surface text-primary border border-surface-variant dark:border-dark-surface-variant'}`}
                        >
                            Member Directory
                        </button>
                        <button 
                            onClick={() => setActiveTab('analytics')}
                            className={`px-6 sm:px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'analytics' ? 'bg-primary text-white shadow-xl' : 'bg-white dark:bg-dark-surface text-primary border border-surface-variant dark:border-dark-surface-variant'}`}
                        >
                            Analytics
                        </button>
                    </div>
                </section>

                {/* Statistics Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Cloud Users', value: stats.totalUsers, icon: <Users className="w-16 h-16 opacity-5 absolute -right-4 -bottom-4" />, color: 'bg-primary text-white' },
                        { label: 'Total Catalog', value: stats.totalProperties, icon: <Building className="w-16 h-16 opacity-5 absolute -right-4 -bottom-4" />, color: 'bg-white dark:bg-dark-surface text-primary dark:text-white border border-surface-variant dark:border-dark-surface-variant' },
                        { label: 'Pending Review', value: stats.pendingProperties, icon: <FileText className="w-16 h-16 opacity-5 absolute -right-4 -bottom-4" />, color: 'bg-secondary text-white' },
                        { label: 'Live Estates', value: stats.approvedProperties, icon: <CheckCircle className="w-16 h-16 opacity-5 absolute -right-4 -bottom-4" />, color: 'bg-white dark:bg-dark-surface text-primary dark:text-white border border-surface-variant dark:border-dark-surface-variant' }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} p-8 rounded-[3.5rem] shadow-xl relative overflow-hidden group`}>
                            <div className="relative z-10 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                            </div>
                            {stat.icon}
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
                        <div className="flex justify-between items-end border-b border-surface-variant/40 dark:border-dark-surface-variant/40 pb-6">
                            <h2 className="font-headline font-black text-3xl text-primary dark:text-white tracking-tight">Appraisal Queue</h2>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">{stats.pendingProperties} pending actions</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {properties.map((prop) => (
                                <div key={prop._id} className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[3rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 hover:shadow-2xl transition-all group">
                                    <div className="w-full lg:w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-lg shrink-0">
                                        <img 
                                            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                            alt={prop.title} 
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4 text-center lg:text-left min-w-0">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                                <h3 className="font-headline font-black text-2xl text-primary dark:text-white truncate">{prop.title}</h3>
                                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${prop.status === 'Approved' ? 'bg-secondary/10 text-secondary' : 'bg-primary/5 text-primary'}`}>{prop.status}</span>
                                            </div>
                                            <p className="text-on-surface-variant dark:text-dark-on-surface-variant font-bold text-sm">
                                                {prop.location}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                            <span>{prop.bedrooms || 3} BD</span>
                                            <span>{prop.bathrooms || 2} BT</span>
                                            <span>{prop.area || '2400'} SQFT</span>
                                            <span className="text-primary dark:text-dark-primary">₹ {prop.price.toLocaleString()}</span>
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
                                            className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant text-primary dark:text-dark-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary transition-all"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : activeTab === 'users' ? (
                    <section className="space-y-8 animate-fade-in-up">
                         <div className="flex justify-between items-end border-b border-surface-variant/40 dark:border-dark-surface-variant/40 pb-6">
                            <h2 className="font-headline font-black text-2xl sm:text-3xl text-primary dark:text-white tracking-tight">Member Directory</h2>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">{stats.totalUsers} identities</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {users.map((u) => (
                                <div key={u._id} className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2.5rem] p-6 flex flex-col gap-4 hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={u.profileImage || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
                                            className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-primary/5 shrink-0"
                                            alt=""
                                        />
                                        <div className="min-w-0 flex-1">
                                            {u.role === 'agent' ? (
                                                <Link to={`/agent/${u._id}`} className="font-black text-primary dark:text-dark-primary truncate text-base hover:underline block">
                                                    {u.name} <span className="text-[8px] font-black uppercase tracking-widest text-accent">(Agent)</span>
                                                </Link>
                                            ) : (
                                                <p className="font-black text-primary dark:text-white truncate text-base">{u.name}</p>
                                            )}
                                            <p className="text-xs font-bold text-on-surface-variant dark:text-dark-on-surface-variant opacity-60 truncate">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-surface-variant/20">
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] ${u.provider === 'google' ? 'bg-secondary/10 text-secondary' : 'bg-primary/5 text-primary/50'}`}>
                                            {u.provider === 'google' ? 'Google' : 'Email'}
                                        </span>
                                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{u.gender || '—'}</span>
                                        {u.email !== 'himanshumandal799@gmail.com' && (
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="w-10 h-10 rounded-xl bg-error/5 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center shadow-sm"
                                                title="Remove user"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    // --- ANALYTICS TAB CONTENT ---
                    <section className="space-y-8 animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-surface-variant/40 dark:border-dark-surface-variant/40 pb-6">
                            <h2 className="font-headline font-black text-3xl text-primary dark:text-white tracking-tight">System Analytics & Growth</h2>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <BarChart3 className="w-3.5 h-3.5" />
                                Real-Time Streams
                            </div>
                        </div>

                        {analytics ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Chart 1: Registration Trend (Line Chart) */}
                                <div className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-4">
                                    <h3 className="font-headline font-black text-lg text-primary dark:text-white uppercase tracking-wider">User Registration Growth</h3>
                                    
                                    <div className="relative border border-surface-variant/30 p-2 rounded-2xl bg-surface-variant/5">
                                        <svg viewBox="0 0 450 180" className="w-full h-auto overflow-visible">
                                            <line x1="40" y1="30" x2="410" y2="30" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />
                                            <line x1="40" y1="90" x2="410" y2="90" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />
                                            <line x1="40" y1="150" x2="410" y2="150" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />

                                            <polyline
                                                fill="none"
                                                stroke="#B8860B"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                points={getLineChartPoints(analytics.charts.registrationTrend)}
                                            />

                                            {analytics.charts.registrationTrend.map((t, idx) => {
                                                const paddingX = 40;
                                                const paddingY = 30;
                                                const width = 450;
                                                const height = 180;
                                                const maxVal = Math.max(...analytics.charts.registrationTrend.map(tr => tr.users));
                                                const minVal = Math.min(...analytics.charts.registrationTrend.map(tr => tr.users));
                                                const range = maxVal - minVal || 1;

                                                const x = paddingX + (idx * (width - paddingX * 2) / (analytics.charts.registrationTrend.length - 1));
                                                const y = height - paddingY - ((t.users - minVal) * (height - paddingY * 2) / range);

                                                return (
                                                    <g key={idx}>
                                                        <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#B8860B" strokeWidth="2.5" />
                                                        <text x={x} y={y - 12} fontSize="9" fontWeight="900" textAnchor="middle" fill="#1A1F2C">
                                                            {t.users}
                                                        </text>
                                                        <text x={x} y="170" fontSize="8" fontWeight="800" textAnchor="middle" fill="#6B7280">
                                                            {t.month}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>
                                </div>

                                {/* Chart 2: Inquiries Trend (Line/Bar Chart) */}
                                <div className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-4">
                                    <h3 className="font-headline font-black text-lg text-primary dark:text-white uppercase tracking-wider">Inquiry Traffic</h3>
                                    
                                    <div className="relative border border-surface-variant/30 p-2 rounded-2xl bg-surface-variant/5">
                                        <svg viewBox="0 0 450 180" className="w-full h-auto overflow-visible">
                                            <line x1="40" y1="30" x2="410" y2="30" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />
                                            <line x1="40" y1="90" x2="410" y2="90" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />
                                            <line x1="40" y1="150" x2="410" y2="150" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />

                                            <polyline
                                                fill="none"
                                                stroke="#3B82F6"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                points={getLineChartPoints(analytics.charts.inquiryTrend)}
                                            />

                                            {analytics.charts.inquiryTrend.map((t, idx) => {
                                                const paddingX = 40;
                                                const paddingY = 30;
                                                const width = 450;
                                                const height = 180;
                                                const maxVal = Math.max(...analytics.charts.inquiryTrend.map(tr => tr.inquiries));
                                                const minVal = Math.min(...analytics.charts.inquiryTrend.map(tr => tr.inquiries));
                                                const range = maxVal - minVal || 1;

                                                const x = paddingX + (idx * (width - paddingX * 2) / (analytics.charts.inquiryTrend.length - 1));
                                                const y = height - paddingY - ((t.inquiries - minVal) * (height - paddingY * 2) / range);

                                                return (
                                                    <g key={idx}>
                                                        <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />
                                                        <text x={x} y={y - 12} fontSize="9" fontWeight="900" textAnchor="middle" fill="#1A1F2C">
                                                            {t.inquiries}
                                                        </text>
                                                        <text x={x} y="170" fontSize="8" fontWeight="800" textAnchor="middle" fill="#6B7280">
                                                            {t.month}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>
                                </div>

                                {/* Catalog breakdown card */}
                                <div className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6">
                                    <h3 className="font-headline font-black text-lg text-primary dark:text-white uppercase tracking-wider">Catalog Allocation</h3>
                                    
                                    <div className="space-y-5">
                                        {/* Buy breakdown */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-black uppercase text-primary dark:text-white">
                                                <span>Buy Properties</span>
                                                <span>{analytics.stats.categoryBreakdown.buy} Listings</span>
                                            </div>
                                            <div className="w-full h-3 bg-surface-variant/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-accent rounded-full transition-all duration-1000"
                                                    style={{ width: `${(analytics.stats.categoryBreakdown.buy / (analytics.stats.totalProperties || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Rent breakdown */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-black uppercase text-primary dark:text-white">
                                                <span>Rent Properties</span>
                                                <span>{analytics.stats.categoryBreakdown.rent} Listings</span>
                                            </div>
                                            <div className="w-full h-3 bg-surface-variant/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary rounded-full transition-all duration-1000"
                                                    style={{ width: `${(analytics.stats.categoryBreakdown.rent / (analytics.stats.totalProperties || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Viewed Properties */}
                                <div className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6">
                                    <h3 className="font-headline font-black text-lg text-primary dark:text-white uppercase tracking-wider">Top Performing Listings</h3>
                                    
                                    <div className="divide-y divide-surface-variant/20 dark:divide-dark-surface-variant/20">
                                        {analytics.topProperties.map((p, index) => (
                                            <div key={p._id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                                                <div className="min-w-0 pr-4">
                                                    <h4 className="text-sm font-black text-primary dark:text-white truncate">{p.title}</h4>
                                                    <p className="text-[10px] font-black uppercase text-on-surface-variant/40 tracking-wider truncate">{p.location}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-accent font-black text-xs shrink-0">
                                                    <Eye className="w-4 h-4 text-accent/50" />
                                                    <span>{p.views || 0} Views</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-[2.5rem] p-8 text-center text-xs font-bold text-on-surface-variant/40 dark:text-dark-on-surface-variant/40 py-20 uppercase tracking-widest">
                                Loading Analytics Data Streams...
                            </div>
                        )}
                    </section>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
