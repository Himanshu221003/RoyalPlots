import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function AddProperty() {
    const navigate = useNavigate();
    const { authFetch } = useAuth();
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        area: '',
        category: 'buy',
        description: '',
    });

    const [images, setImages] = useState([]); // Actual file objects
    const [previews, setPreviews] = useState([]); // Local URLs for preview
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            setError("Maximum 5 images allowed.");
            return;
        }

        setImages(prev => [...prev, ...files]);
        
        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        setError('');
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadToCloudinary = async (file) => {
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
                return result.secure_url;
            } else {
                throw new Error(result.error?.message || 'Cloudinary upload failed');
            }
        } catch (err) {
            console.error('Cloudinary Error:', err);
            throw err;
        }
    };

    const submitProperty = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price || !formData.location || !formData.area) {
            setError("All required fields must be filled.");
            return;
        }

        if (images.length === 0) {
            setError("At least one property image is required.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 1. Upload all images to Cloudinary in parallel
            const uploadPromises = images.map(file => uploadToCloudinary(file));
            const imageUrls = await Promise.all(uploadPromises);

            // 2. Submit data to our backend
            const res = await authFetch(`${API_URL}/api/properties`, {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    images: imageUrls
                })
            });

            if (res.ok) {
                navigate('/admin');
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to save property to database.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during upload. Please check your Cloudinary config.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32">
            <Navbar />

            <main className="pt-20 sm:pt-32 container-responsive">
                <div className="max-w-3xl mx-auto space-y-12 animate-fade-in-up">
                    <div className="space-y-4 text-center">
                        <h1 className="font-headline font-black text-4xl sm:text-5xl text-primary tracking-tight">Cloud Listing</h1>
                        <p className="text-on-surface-variant font-bold text-base sm:text-lg max-w-xl mx-auto">
                            Upload your estate images securely with RoyalPlots Cloudinary Integration.
                        </p>
                    </div>

                    <form onSubmit={submitProperty} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-8 sm:p-12 rounded-[3.5rem] border border-surface-variant shadow-2xl relative overflow-hidden">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Property Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all"
                                placeholder="e.g. Maharana Suite at Shyamala Hills"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Expected Price (₹)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all"
                                placeholder="e.g. 25000000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all"
                                placeholder="e.g. Arera Colony, Bhopal"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Bedrooms</label>
                            <input
                                name="bedrooms"
                                type="number"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Bathrooms</label>
                            <input
                                name="bathrooms"
                                type="number"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Area (SQFT)</label>
                            <input
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all"
                                placeholder="e.g. 2400"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all appearance-none cursor-pointer"
                            >
                                <option value="buy">For Sale</option>
                                <option value="rent">For Rent</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white focus:ring-0 font-bold transition-all resize-none h-32"
                                placeholder="Describe the luxury and features of this estate..."
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Property Images (Max 5)</label>
                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{images.length}/5 High-Res</span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-surface-variant group">
                                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                                {images.length < 5 && (
                                    <label className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 transition-all text-primary/40 hover:text-primary">
                                        <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Select</span>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="col-span-1 md:col-span-2 bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 text-error">
                                <span className="material-symbols-outlined">error</span>
                                <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                            </div>
                        )}

                        <div className="col-span-1 md:col-span-2 pt-6">
                            <button
                                disabled={isSubmitting}
                                className="w-full py-5 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                type="submit"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span>Cloud Upload in Progress...</span>
                                    </>
                                ) : 'Sync with RoyalPlots Cloud'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
