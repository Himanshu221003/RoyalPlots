import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share2, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const defaultReels = [
    {
        id: "1",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
        title: "The Midnight Manor",
        location: "Indore",
        likes: "1.2k",
        comments: "45"
    },
    {
        id: "2",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        image: "https://images.unsplash.com/photo-1600607687940-4e524cb357bd?w=400&q=80",
        title: "Azure Pool Villa",
        location: "Bhopal",
        likes: "2.5k",
        comments: "82"
    },
    {
        id: "3",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        image: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=400&q=80",
        title: "Heritage Penthouse",
        location: "Gwalior",
        likes: "950",
        comments: "31"
    }
];

export default function PropertyReels() {
    const { user, toggleFavorite } = useAuth();
    const navigate = useNavigate();
    const [reels, setReels] = useState(defaultReels);
    const [currentReel, setCurrentReel] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchReelsProperties = async () => {
            try {
                const res = await fetch(`${API_URL}/api/properties`);
                if (res.ok) {
                    const data = await res.json();
                    const approved = data.properties.filter(p => p.status === 'Approved');
                    if (approved.length > 0) {
                        const demoVideos = [
                            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
                        ];
                        const mapped = approved.slice(0, 3).map((prop, idx) => ({
                            id: prop._id,
                            video: demoVideos[idx % demoVideos.length],
                            image: (prop.images && prop.images[0]) || prop.coverImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
                            title: prop.title,
                            location: prop.location,
                            likes: idx === 0 ? "1.8k" : idx === 1 ? "2.3k" : "980",
                            comments: idx === 0 ? "54" : idx === 1 ? "89" : "27"
                        }));
                        if (mapped.length < 3) {
                            const combined = [...mapped, ...defaultReels.slice(mapped.length)];
                            setReels(combined);
                        } else {
                            setReels(mapped);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching reels properties:", err);
            }
        };
        fetchReelsProperties();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            if (isPlaying) {
                videoRef.current.play().catch(err => console.log("Auto-play blocked:", err));
            }
        }
    }, [currentReel]);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(err => console.log("Play failed:", err));
        }
        setIsPlaying(!isPlaying);
    };

    const isFavorite = user?.favorites?.includes(reels[currentReel]?.id);

    return (
        <section className="container-responsive py-24 space-y-16">
            <div className="text-center space-y-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary dark:text-dark-primary rounded-full text-[10px] font-black uppercase tracking-widest"
                >
                    Elite Experiences
                </motion.div>
                <h2 className="font-headline font-black text-4xl sm:text-6xl text-primary dark:text-dark-on-surface tracking-tighter">
                    Property <span className="text-accent italic font-display">Reels</span>
                </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
                {/* Reel Player */}
                <div className="relative w-full max-w-[400px] aspect-[9/16] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-black group">
                    <video
                        ref={videoRef}
                        src={reels[currentReel]?.video}
                        loop
                        muted={isMuted}
                        autoPlay
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={togglePlay}
                    />

                    {/* Overlay UI */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
                    
                    {/* Controls */}
                    <div className="absolute top-8 right-6 flex flex-col gap-4">
                        <button 
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-primary transition-all pointer-events-auto"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Interaction Bar */}
                    <div className="absolute right-6 bottom-32 flex flex-col gap-6 items-center pointer-events-auto">
                        <div 
                            onClick={() => reels[currentReel]?.id && toggleFavorite(reels[currentReel].id)} 
                            className="flex flex-col items-center gap-1 group/icon cursor-pointer animate-fade-in"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all ${isFavorite ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'text-white group-hover/icon:bg-red-500'}`}>
                                <Heart className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} />
                            </div>
                            <span className="text-[10px] font-black text-white">{reels[currentReel]?.likes}</span>
                        </div>
                        <div 
                            onClick={() => reels[currentReel]?.id && navigate(`/property/${reels[currentReel].id}`)} 
                            className="flex flex-col items-center gap-1 group/icon cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover/icon:bg-accent transition-all">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-white">{reels[currentReel]?.comments}</span>
                        </div>
                        <div 
                            onClick={() => reels[currentReel]?.id && navigate(`/property/${reels[currentReel].id}`)} 
                            className="flex flex-col items-center gap-1 group/icon cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover/icon:bg-white group-hover/icon:text-primary transition-all">
                                <ExternalLink className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Info - Clickable to open Property details */}
                    <div 
                        onClick={() => reels[currentReel]?.id && navigate(`/property/${reels[currentReel].id}`)}
                        className="absolute bottom-8 left-8 right-20 pointer-events-auto cursor-pointer group/info select-none"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{reels[currentReel]?.location}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover/info:text-accent transition-colors flex items-center gap-2">
                            {reels[currentReel]?.title}
                        </h3>
                        <p className="text-white/60 text-xs font-medium group-hover/info:text-white/80 transition-colors">
                            Click to explore residence details & portfolio.
                        </p>
                    </div>

                    {/* Play/Pause Indicator (Overlay) */}
                    <AnimatePresence>
                        {!isPlaying && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                    <Play className="w-10 h-10 text-white fill-current animate-pulse" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Thumbnails / Selector */}
                <div className="flex lg:flex-col gap-6 overflow-x-auto max-w-full no-scrollbar py-2">
                    {reels.map((reel, i) => (
                        <button
                            key={reel.id + '-' + i}
                            onClick={() => { setCurrentReel(i); setIsPlaying(true); }}
                            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] overflow-hidden border-4 transition-all shrink-0 ${currentReel === i ? 'border-accent scale-110 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <img src={reel.image} className="w-full h-full object-cover" alt={reel.title} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
