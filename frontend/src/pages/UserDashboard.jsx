import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function UserDashboard() {
    const navigate = useNavigate();
    const { user, logout, authFetch, profileImage, saveProfile, toggleFavorite } = useAuth();
    
    const [inquiryCount, setInquiryCount] = useState(0);
    const [savedProperties, setSavedProperties] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        gender: "other",
        profileImage: "",
    });

    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name || user.fullName || "",
                gender: user.gender || "other",
                profileImage: user.profileImage || "",
            });
            fetchUserInquiries();
            fetchSavedProperties();
        }
    }, [user]);

    const fetchUserInquiries = async () => {
        try {
            const res = await authFetch(`${API_URL}/api/inquiries`);
            if (res.ok) {
                const data = await res.json();
                const filtered = user?.email === 'admin@royalplots.com'
                    ? data.inquiries
                    : data.inquiries.filter(inq => inq.buyerEmail === user?.email);
                setInquiryCount(filtered.length);
            }
        } catch (err) {
            console.error('Error fetching inquiries count:', err);
        }
    };

    const fetchSavedProperties = async () => {
        if (!user?.favorites || user.favorites.length === 0) {
            setSavedProperties([]);
            return;
        }
        setLoadingSaved(true);
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (res.ok) {
                const data = await res.json();
                const filtered = data.properties.filter(p => user.favorites.includes(p._id));
                setSavedProperties(filtered);
            }
        } catch (err) {
            console.error('Error fetching saved properties:', err);
        } finally {
            setLoadingSaved(false);
        }
    };

    const uploadAvatarToCloudinary = async (file) => {
        setUploadingAvatar(true);
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload';
        
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (result.secure_url) {
                setEditData(prev => ({ ...prev, profileImage: result.secure_url }));
            }
        } catch (err) {
            console.error('Avatar Upload Error:', err);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        if (e) e.preventDefault();
        setUpdateLoading(true);
        try {
            await saveProfile(editData);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-20 sm:pt-32 container-responsive lg:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Profile & Stats Hub */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="bg-white border border-surface-variant rounded-[3.5rem] p-10 flex flex-col items-center text-center space-y-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-secondary" />
                            <div className="relative">
                                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-primary/5 p-1 overflow-hidden shadow-2xl bg-white">
                                    <img className="w-full h-full object-cover rounded-[2rem]" src={profileImage} alt="" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="material-symbols-outlined text-lg">verified</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h2 className="font-headline font-black text-3xl text-primary tracking-tight truncate w-full">{user.name}</h2>
                                <p className="text-sm font-bold text-on-surface-variant opacity-60 truncate w-full">{user.email}</p>
                            </div>
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full py-4 bg-primary/5 text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all"
                            >
                                Edit Profile Identity
                            </button>
                        </section>

                        <section className="grid grid-cols-2 gap-4">
                            <div className="bg-primary p-6 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-2">
                                <h3 className="text-3xl font-black">{user.favorites?.length || 0}</h3>
                                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Saved Items</p>
                            </div>
                            <div className="bg-secondary p-6 rounded-[2.5rem] text-white shadow-xl shadow-secondary/20 flex flex-col items-center justify-center gap-2">
                                <h3 className="text-3xl font-black">{inquiryCount}</h3>
                                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Inquiries</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <button onClick={logout} className="w-full py-5 bg-error/5 text-error rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-error hover:text-white transition-all flex items-center justify-center gap-3">
                                <span className="material-symbols-outlined text-base">logout</span>
                                End Session
                            </button>
                        </section>
                    </div>

                    {/* Dashboard Views */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Saved Properties Collection */}
                        <section className="space-y-8">
                            <div className="flex justify-between items-end border-b border-surface-variant pb-6">
                                <h2 className="font-headline font-black text-3xl text-primary tracking-tight">Saved Estates</h2>
                                <Link to="/properties" className="text-secondary font-black text-[10px] uppercase tracking-widest hover:underline">Explore More</Link>
                            </div>

                            {loadingSaved ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-10 h-10 border-4 border-primary/5 border-t-primary rounded-full animate-spin" />
                                    <span className="text-[10px] font-black uppercase text-primary/40">Syncing Collection...</span>
                                </div>
                            ) : savedProperties.length === 0 ? (
                                <div className="text-center py-24 glass rounded-[3.5rem] space-y-4 border-dashed border-2 border-primary/10">
                                    <span className="material-symbols-outlined text-5xl text-primary/10">favorite</span>
                                    <div className="space-y-1">
                                        <p className="font-black text-primary uppercase tracking-widest text-sm">Your gallery is empty</p>
                                        <p className="text-xs font-bold text-on-surface-variant opacity-60">Properties you save will appear here for quick access.</p>
                                    </div>
                                    <button onClick={() => navigate('/properties')} className="mt-4 px-8 py-3 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Start Exploring</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {savedProperties.map((prop) => (
                                        <div key={prop._id} className="relative group bg-white border border-surface-variant rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all">
                                            <div className="aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${prop._id}`)}>
                                                <img src={prop.images?.[0] || prop.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                                            </div>
                                            <button 
                                                onClick={() => toggleFavorite(prop._id)}
                                                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                                            </button>
                                            <div className="p-6 space-y-2">
                                                 <Link to={`/property/${prop._id}`}>
                                                    <h4 className="font-black text-primary text-lg truncate group-hover:text-secondary transition-colors cursor-pointer hover:underline">{prop.title}</h4>
                                                 </Link>
                                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">₹ {prop.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Recent Activity / Quick Actions */}
                        <section className="bg-primary/5 rounded-[3.5rem] p-10 space-y-6">
                             <h3 className="font-headline font-black text-xl text-primary">Priority Services</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <button onClick={() => navigate('/inquiries')} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-surface-variant hover:border-primary transition-all group">
                                     <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                         <span className="material-symbols-outlined text-xl">mark_as_unread</span>
                                     </div>
                                     <div className="text-left">
                                         <p className="font-black text-primary text-sm uppercase">Message Center</p>
                                         <p className="text-[10px] font-bold text-on-surface-variant opacity-60">Manage your property inquiries</p>
                                     </div>
                                 </button>
                                 <button onClick={() => navigate('/add-property')} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-surface-variant hover:border-secondary transition-all group">
                                     <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                                         <span className="material-symbols-outlined text-xl">add_business</span>
                                     </div>
                                     <div className="text-left">
                                         <p className="font-black text-secondary text-sm uppercase">List Estate</p>
                                         <p className="text-[10px] font-bold text-on-surface-variant opacity-60">Upload your premium property</p>
                                     </div>
                                 </button>
                             </div>
                        </section>
                    </div>
                </div>
            </main>

            <BottomNav />

            {/* Edit Modal (Keep existing logic) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 space-y-8 animate-fade-in-up">
                        <div className="flex justify-between items-center border-b border-surface-variant pb-6">
                            <h3 className="text-2xl font-black text-primary tracking-tight">Identity Settings</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/20 transition-all">
                                <span className="material-symbols-outlined text-primary">close</span>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-6">
                            <div className="flex justify-center pb-4">
                                <label className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-primary/10 group-hover:border-primary transition-all">
                                        <img src={editData.profileImage || profileImage} className="w-full h-full object-cover" alt="Avatar" />
                                        {uploadingAvatar && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAvatarToCloudinary(e.target.files[0])} />
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Full Name</label>
                                <input className="w-full px-6 py-4 bg-surface-variant/20 border-none rounded-2xl font-bold" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Gender Identity</label>
                                <select className="w-full px-6 py-4 bg-surface-variant/20 border-none rounded-2xl font-bold appearance-none cursor-pointer" value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })} required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button type="submit" disabled={updateLoading || uploadingAvatar} className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50">
                                {updateLoading ? 'Saving...' : 'Sync Profile Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
