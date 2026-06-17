import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function About() {
    return (
        <div className="bg-background text-on-surface min-h-screen pb-24 overflow-x-hidden">
            <Navbar />
            
            <main className="pt-24 sm:pt-32 space-y-24">
                <section className="container-responsive px-4 text-center space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">Our Story</span>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-primary leading-none tracking-tighter">
                            Redefining Living <br />
                            <span className="text-secondary">Since 2026</span>
                        </h1>
                    </div>
                    <p className="text-on-surface-variant text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        RoyalPlots started with a simple vision: to make high-end real estate accessible through technology and trust. Today, we are Madhya Pradesh's leading property management platform.
                    </p>
                </section>

                <section className="container-responsive px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-video md:aspect-square">
                        <img 
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop" 
                            alt="Office" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-8 text-left">
                        <h2 className="text-3xl sm:text-5xl font-black text-primary tracking-tight">Our Core Values</h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Authenticity', desc: 'Every listing on our platform is verified by our team for 100% transparency.', icon: 'verified' },
                                { title: 'Modern Living', desc: 'We focus on properties that offer smart features and sustainable architecture.', icon: 'eco' },
                                { title: 'Client First', desc: 'Our agents work for your dreams, ensuring a seamless paperwork and legal process.', icon: 'handshake' }
                            ].map((value) => (
                                <div key={value.title} className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <span className="material-symbols-outlined">{value.icon}</span>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-bold text-xl text-primary">{value.title}</h3>
                                        <p className="text-on-surface-variant font-medium leading-relaxed">{value.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-primary/5 py-24 sm:py-32">
                    <div className="container-responsive px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Properties Sold', val: '2.5k+' },
                            { label: 'Happy Families', val: '1.8k+' },
                            { label: 'Cities Covered', val: '12' },
                            { label: 'Expert Agents', val: '80+' }
                        ].map((stat) => (
                            <div key={stat.label} className="text-center space-y-2">
                                <div className="text-3xl sm:text-5xl font-black text-primary tracking-tighter">{stat.val}</div>
                                <div className="text-[10px] sm:text-xs font-black text-secondary uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
}
