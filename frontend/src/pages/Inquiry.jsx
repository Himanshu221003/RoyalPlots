import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function Inquiry() {
    const navigate = useNavigate();
    const { authFetch } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await authFetch(`${API_URL}/api/inquiries`);
            if (res.ok) {
                const data = await res.json();
                setInquiries(data.inquiries);
                setFilteredInquiries(data.inquiries);
            }
        } catch (err) {
            console.error('Error fetching inquiries:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, currentStatus) => {
        const nextStatusMap = {
            'Sent': 'Viewed',
            'Viewed': 'Responded',
            'Responded': 'Resolved',
            'Resolved': 'Sent'
        };
        const newStatus = nextStatusMap[currentStatus] || 'Sent';

        try {
            const res = await authFetch(`${API_URL}/api/inquiries/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                const updated = inquiries.map(inq =>
                    inq._id === id ? { ...inq, status: newStatus } : inq
                );
                setInquiries(updated);
                setFilteredInquiries(updated);
            }
        } catch (err) {
            console.error('Error updating inquiry status:', err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const results = inquiries.filter(inq => 
            inq.propertyName.toLowerCase().includes(value.toLowerCase()) ||
            inq.buyerName.toLowerCase().includes(value.toLowerCase()) ||
            inq.status.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredInquiries(results);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Responded': return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'Resolved': return 'bg-surface-variant/20 text-on-surface-variant border-surface-variant/20';
            case 'Viewed': return 'bg-primary/5 text-primary border-primary/20';
            case 'Sent': 
            default: return 'bg-primary text-white border-primary';
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-20 sm:pt-32 container-responsive space-y-12">
                <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-surface-variant pb-8">
                    <div className="space-y-1">
                        <h1 className="font-headline font-black text-4xl text-primary tracking-tight">Inquiry Inbox</h1>
                        <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Global Communications Manager</p>
                    </div>
                    <div className="relative w-full sm:w-64 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">search</span>
                        <input 
                            className="w-full pl-12 pr-4 py-3 bg-surface border-2 border-surface-variant rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all text-sm" 
                            placeholder="Filter messages..." 
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </section>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                            <span className="text-[10px] font-black uppercase text-primary/40">Accessing secure channel...</span>
                        </div>
                    ) : filteredInquiries.length === 0 ? (
                        <div className="text-center py-32 glass rounded-[3rem] space-y-4">
                            <span className="material-symbols-outlined text-6xl text-primary/10">mail_outline</span>
                            <p className="text-on-surface-variant font-bold text-lg">No active inquiries found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredInquiries.map((inq) => (
                                <div 
                                    key={inq._id} 
                                    className="bg-surface rounded-[2.5rem] p-8 border border-surface-variant hover:border-primary/20 hover:shadow-2xl transition-all group flex flex-col justify-between space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <Link to={`/property/${inq.propertyId}`} className="hover:underline">
                                                    <h3 className="font-headline font-black text-xl text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-1">{inq.propertyName}</h3>
                                                </Link>
                                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Inquiry from <span className="text-primary">{inq.buyerName}</span></p>
                                            </div>
                                            <span className="text-[10px] font-black text-on-surface-variant/40 whitespace-nowrap">
                                                {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently'}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-primary/5 p-6 rounded-3xl border-l-4 border-secondary relative">
                                            <span className="material-symbols-outlined absolute top-2 right-2 text-primary/10 text-2xl">format_quote</span>
                                            <p className="text-sm font-bold text-primary/80 leading-relaxed italic line-clamp-3">"{inq.message}"</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-surface-variant">
                                        <button 
                                            onClick={() => updateStatus(inq._id, inq.status)}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95 ${getStatusStyle(inq.status)}`}
                                        >
                                            <span className="material-symbols-outlined text-sm">{inq.status === 'Resolved' ? 'check_circle' : 'bolt'}</span>
                                            {inq.status}
                                        </button>
                                        <span className="font-black text-secondary text-sm">{inq.price || 'Market Rate'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
