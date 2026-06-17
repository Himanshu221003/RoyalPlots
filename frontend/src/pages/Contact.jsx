import { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32 overflow-x-hidden">
            <Navbar />

            <main className="pt-20 sm:pt-32 space-y-12 sm:space-y-20">
                <section className="container-responsive">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
                        {/* Info Side */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <span className="inline-block px-5 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-black uppercase tracking-widest">Let's Connect</span>
                                <h1 className="text-4xl sm:text-6xl font-black text-primary leading-none tracking-tighter">Get in touch</h1>
                                <p className="text-on-surface-variant text-base sm:text-lg font-medium leading-relaxed max-w-lg">
                                    Have questions about a property or want to list your own? Our expert team is here to assist you across India.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Email Us', val: 'himanshu@gmail.com', icon: 'alternate_email', href: 'mailto:himanshu@gmail.com' },
                                    { title: 'Call Us', val: '+91 8541974985', icon: 'call', href: 'tel:+918541974985' },
                                    { title: 'Visit Us', val: 'Roorkee, Uttarakhand', icon: 'distance', href: '#' }
                                ].map((item) => (
                                    <a key={item.title} href={item.href} className="flex gap-5 items-center group tap-target">
                                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 block">{item.title}</span>
                                            <p className="text-lg font-black text-primary truncate">{item.val}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-7 sm:p-12 shadow-2xl shadow-primary/5 border border-surface-variant">
                            {sent ? (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
                                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                                    </div>
                                    <p className="font-black text-primary text-xl uppercase tracking-widest">Message Sent!</p>
                                    <p className="text-sm text-on-surface-variant font-bold">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Your full name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Email</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Interested in a property listing"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Message</label>
                                        <textarea
                                            rows={5}
                                            className="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            placeholder="Tell us what you're looking for..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 tap-target"
                                    >
                                        <span>Send Message</span>
                                        <span className="material-symbols-outlined text-base">send</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>

                <section className="container-responsive pb-8">
                    <div className="w-full h-80 sm:h-[400px] bg-primary/5 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-surface-variant relative">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55301.76595267332!2d77.85407005437812!3d29.865860252199742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb36e2cc7a159%3A0xe44093950b7194f!2sRoorkee%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1716380000000!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, filter: 'grayscale(0.1) contrast(1.05)' }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Interactive Map"
                        />
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
}
