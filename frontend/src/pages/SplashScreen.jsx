import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(isAuthenticated ? '/home' : '/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate, isAuthenticated]);

    return (
        <main className="relative h-screen w-full flex flex-col items-center justify-center bg-primary overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-secondary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/10 rounded-full blur-[100px]"></div>
            
            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-12">
                {/* Logo Animation */}
                <div className="relative group">
                    <div className="w-32 h-32 flex items-center justify-center bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-2xl animate-float">
                        <span className="material-symbols-outlined text-white text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <span className="material-symbols-outlined text-on-secondary-container text-2xl font-black">verified</span>
                    </div>
                </div>

                <div className="space-y-4 animate-fade-in-up">
                    <h1 className="font-headline font-black text-6xl text-white tracking-tighter">RoyalPlots</h1>
                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-px w-8 bg-white/20"></div>
                        <p className="text-[10px] font-black tracking-[0.3em] text-secondary-container uppercase">Premium Estate Curator</p>
                        <div className="h-px w-8 bg-white/20"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Progress */}
            <div className="absolute bottom-20 w-full max-w-[200px] space-y-4 px-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-secondary-container rounded-full animate-[loading_3s_ease-in-out]"></div>
                </div>
                <div className="flex justify-center flex-col items-center gap-2">
                    <span className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase">Authenticating Channel</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1 h-1 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
            ` }} />
        </main>
    );
}
