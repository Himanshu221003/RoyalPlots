import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, Users2, ArrowRight, Mic, Star, X, ChevronDown, BedDouble, Bath, Maximize, Loader2, Mail, Phone, User, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceSearch from './VoiceSearch';

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&auto=format&fit=crop",
        title: "Modern Minimalist",
        subtitle: "Luxury Reimagined"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1600607687940-4e524cb357bd?w=1920&auto=format&fit=crop",
        title: "Heritage Estates",
        subtitle: "Timeless Elegance"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=1920&auto=format&fit=crop",
        title: "Urban Sanctuary",
        subtitle: "Inner-City Bliss"
    }
];

// Comprehensive dataset of Indian cities and their respective states
const INDIAN_CITIES = [
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi', state: 'Delhi NCR' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Ahmedabad', state: 'Gujarat' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Bhopal', state: 'Madhya Pradesh' },
    { name: 'Indore', state: 'Madhya Pradesh' },
    { name: 'Surat', state: 'Gujarat' },
    { name: 'Patna', state: 'Bihar' },
    { name: 'Guwahati', state: 'Assam' },
    { name: 'Chandigarh', state: 'Punjab' },
    { name: 'Kochi', state: 'Kerala' },
    { name: 'Noida', state: 'Delhi NCR' },
    { name: 'Gurgaon', state: 'Delhi NCR' },
    { name: 'Vizag', state: 'Andhra Pradesh' },
    { name: 'Coimbatore', state: 'Tamil Nadu' },
    { name: 'Nagpur', state: 'Maharashtra' },
    { name: 'Goa', state: 'Goa' }
];

// Searchable Locations Dropdown options
const POPULAR_LOCATIONS = [
    { name: 'Maharashtra', type: 'State' },
    { name: 'Delhi NCR', type: 'State/Region' },
    { name: 'Karnataka', type: 'State' },
    { name: 'Goa', type: 'State' },
    { name: 'Rajasthan', type: 'State' },
    { name: 'Gujarat', type: 'State' },
    { name: 'Punjab', type: 'State' },
    { name: 'West Bengal', type: 'State' },
    { name: 'Madhya Pradesh', type: 'State' },
    { name: 'Kerala', type: 'State' },
    { name: 'Assam', type: 'State' },
    { name: 'Hyderabad', type: 'Metro' },
    { name: 'South Mumbai', type: 'Luxury Zone' },
    { name: 'Bandra', type: 'Luxury Zone' },
    { name: 'Gurgaon', type: 'Metro' },
    { name: 'Noida', type: 'Metro' },
    { name: 'Whitefield', type: 'Luxury Zone' },
    { name: 'Koramangala', type: 'Luxury Zone' },
    { name: 'Powai', type: 'Luxury Zone' }
];

// Simple hash generator to create deterministic, consistent luxury estates based on user input
const getHashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
};

const ESTATE_TEMPLATES = [
    {
        name: "Royal Palm Canopy",
        description: "An architectural marvel overlooking prime vistas, boasting hand-crafted Italian finishes and a multi-tier private pool.",
        tags: ["Infinity Pool", "Private Elevators", "Fully Automated"],
        beds: [4, 5],
        baths: [4, 6],
        area: [4500, 6200],
        priceRange: [12.5, 24.0],
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop"
        ]
    },
    {
        name: "Skyline Sanctum",
        description: "A double-height duplex penthouse hovering above the city, offering panoramic deck spaces and bespoke marble columns.",
        tags: ["Penthouse", "Sky Deck", "Concierge Service"],
        beds: [3, 4],
        baths: [4, 5],
        area: [3800, 5200],
        priceRange: [18.0, 32.5],
        images: [
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600607687940-4e524cb357bd?w=800&auto=format&fit=crop"
        ]
    },
    {
        name: "Emerald Crest Manor",
        description: "A sprawling boutique estate nestled in lush surroundings, featuring a state-of-the-art cinema room and wellness spa.",
        tags: ["Private Spa", "Home Cinema", "Landscape Gardens"],
        beds: [5, 6],
        baths: [6, 8],
        area: [6800, 9500],
        priceRange: [25.0, 45.0],
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop"
        ]
    },
    {
        name: "Zenith Glasshouse",
        description: "Minimalist glass-fronted sanctuary featuring seamless indoor-outdoor transition, smart climate control and a private helipad.",
        tags: ["Helipad", "Smart Automation", "Solar Energy"],
        beds: [4, 5],
        baths: [5, 7],
        area: [5500, 7800],
        priceRange: [28.0, 55.0],
        images: [
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop"
        ]
    },
    {
        name: "The Gilded Pavilion",
        description: "Heritage-inspired luxury villa reflecting classic grandeur with modernized amenities, personal wine cellar, and chef's kitchen.",
        tags: ["Wine Cellar", "Chef's Kitchen", "Bespoke Furnishings"],
        beds: [5, 7],
        baths: [6, 9],
        area: [7500, 11000],
        priceRange: [35.0, 68.0],
        images: [
            "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop"
        ]
    },
    {
        name: "Ocean Crest Residences",
        description: "Exquisite waterfront penthouse offering uninterrupted views, vast sundrenched terraces, and private yacht slip.",
        tags: ["Sea View", "Yacht Slip", "Private Elevator"],
        beds: [3, 4],
        baths: [3, 5],
        area: [4000, 6000],
        priceRange: [22.0, 42.0],
        images: [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop"
        ]
    }
];

const generateEstates = (query, location) => {
    const seedString = `${query.trim().toLowerCase()}-${location.trim().toLowerCase()}`;
    const hash = getHashCode(seedString);
    
    const selectedEstates = [];
    const numTemplates = ESTATE_TEMPLATES.length;
    
    for (let i = 0; i < 3; i++) {
        const index = (hash + i * 7) % numTemplates;
        const template = ESTATE_TEMPLATES[index];
        
        const bedsVal = template.beds[0] + ((hash + i * 11) % (template.beds[1] - template.beds[0] + 1));
        const bathsVal = template.baths[0] + ((hash + i * 13) % (template.baths[1] - template.baths[0] + 1));
        const areaVal = template.area[0] + ((hash + i * 29) % (template.area[1] - template.area[0] + 100));
        
        const priceMin = template.priceRange[0];
        const priceMax = template.priceRange[1];
        const priceStep = (priceMax - priceMin) / 10;
        const priceVal = (priceMin + ((hash + i * 17) % 11) * priceStep).toFixed(1);
        
        const ratingVal = (4.7 + ((hash + i * 3) % 3) * 0.1).toFixed(1);
        
        const imgIndex = (hash + i * 5) % template.images.length;
        const imageUrl = template.images[imgIndex];
        
        let displayLocation = "";
        const cleanLocation = location === "All Locations" ? "" : location;
        const cleanQuery = query.trim();
        
        if (cleanQuery && cleanLocation) {
            displayLocation = `${cleanQuery}, ${cleanLocation}`;
        } else if (cleanQuery) {
            displayLocation = `${cleanQuery}`;
        } else if (cleanLocation) {
            displayLocation = `${cleanLocation}`;
        } else {
            displayLocation = "Malabar Hills, South Mumbai";
        }
        
        selectedEstates.push({
            id: `dynamic-estate-${hash}-${i}`,
            name: template.name,
            description: template.description,
            price: `₹${priceVal} Cr`,
            location: displayLocation,
            bedrooms: bedsVal,
            bathrooms: bathsVal,
            area: `${areaVal} sq ft`,
            rating: ratingVal,
            tags: template.tags,
            image: imageUrl
        });
    }
    
    return selectedEstates;
};

export default function Hero() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    
    // Autocomplete Suggestions State
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [activeCityIndex, setActiveCityIndex] = useState(-1);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    
    // Locations Filter State
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    
    // Showcase Results State
    const [showResults, setShowResults] = useState(false);
    const [isLoadingEstates, setIsLoadingEstates] = useState(false);
    const [estatesResults, setEstatesResults] = useState([]);

    // Private Tour Inquiry Modal State
    const [selectedEstateForInquiry, setSelectedEstateForInquiry] = useState(null);
    const [inquiryName, setInquiryName] = useState('');
    const [inquiryEmail, setInquiryEmail] = useState('');
    const [inquiryPhone, setInquiryPhone] = useState('');
    const [inquirySuccess, setInquirySuccess] = useState(false);

    // Refs for outside click managers
    const cityInputRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // Debounced client-side filtering for instant suggestions
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.trim() === '') {
                setCitySuggestions([]);
                return;
            }
            const filtered = INDIAN_CITIES.filter(city => 
                city.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setCitySuggestions(filtered);
        }, 150);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Handle outside clicks to close autocomplete and custom select panels
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
                setShowCityDropdown(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCityInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowCityDropdown(true);
        setActiveCityIndex(-1);
    };

    const handleCityInputFocus = () => {
        setShowCityDropdown(true);
    };

    const handleCityKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveCityIndex((prevIndex) => 
                prevIndex < citySuggestions.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveCityIndex((prevIndex) => 
                prevIndex > 0 ? prevIndex - 1 : citySuggestions.length - 1
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeCityIndex >= 0 && activeCityIndex < citySuggestions.length) {
                selectCity(citySuggestions[activeCityIndex]);
            } else {
                setShowCityDropdown(false);
                handleExplore();
            }
        } else if (e.key === 'Escape') {
            setShowCityDropdown(false);
            setActiveCityIndex(-1);
        }
    };

    const selectCity = (city) => {
        setSearchQuery(city.name);
        setShowCityDropdown(false);
        setActiveCityIndex(-1);
    };

    const handleCityClick = (city) => {
        selectCity(city);
    };

    const handleExplore = () => {
        setShowCityDropdown(false);
        setShowLocationDropdown(false);
        setIsLoadingEstates(true);
        setShowResults(true);
        
        // Generate properties dynamically based on current query and location selections
        const results = generateEstates(searchQuery, selectedLocation);
        setEstatesResults(results);

        // Smoothly scroll down to results panel once loaded
        setTimeout(() => {
            setIsLoadingEstates(false);
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1200);
    };

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        setInquirySuccess(true);
        setTimeout(() => {
            setInquirySuccess(false);
            setSelectedEstateForInquiry(null);
            setInquiryName('');
            setInquiryEmail('');
            setInquiryPhone('');
        }, 2500);
    };

    const filteredLocations = POPULAR_LOCATIONS.filter(loc => 
        loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
        loc.type.toLowerCase().includes(locationSearchQuery.toLowerCase())
    );

    return (
        <section className={`relative w-full transition-all duration-700 flex items-center justify-center ${showResults ? 'min-h-screen py-24 md:py-32 overflow-y-auto' : 'h-screen min-h-[700px] overflow-hidden'}`}>
            {/* Background Slideshow */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={slides[currentSlide].image}
                        className="w-full h-full object-cover"
                        alt="Hero background"
                    />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:to-dark-bg" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="relative z-10 container-responsive flex flex-col items-center text-center px-4 space-y-12 w-full">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        Premium Property Network
                    </motion.div>

                    <div className="overflow-hidden">
                        <motion.h1
                            key={`title-${currentSlide}`}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="font-headline font-black text-5xl sm:text-7xl md:text-9xl text-white tracking-tighter leading-[0.9]"
                        >
                            {slides[currentSlide].title.split(' ')[0]} <br />
                            <span className="text-accent italic font-display">{slides[currentSlide].title.split(' ')[1]}</span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-white/80 text-sm sm:text-xl font-bold max-w-2xl mx-auto"
                    >
                        Discover unparalleled architectural excellence and luxury living with RoyalPlots – the definitive portfolio for distinguished estates.
                    </motion.p>
                </div>

                {/* Animated Floating Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, type: "spring", damping: 20 }}
                    className="w-full max-w-4xl bg-white/95 dark:bg-[#001e3c]/90 backdrop-blur-xl border border-primary/10 dark:border-accent/30 p-2.5 rounded-[2rem] md:rounded-full flex flex-col md:flex-row shadow-2xl group hover:shadow-accent/15 transition-all"
                >
                    {/* Dynamic City Search Block */}
                    <div ref={cityInputRef} className="relative flex-[1.5] flex items-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-primary/10 dark:border-white/10">
                        <Search className="text-primary dark:text-accent w-5 h-5 mr-4 opacity-60 group-focus-within:text-accent group-focus-within:opacity-100 transition-all" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleCityInputChange}
                            onFocus={handleCityInputFocus}
                            onKeyDown={handleCityKeyDown}
                            placeholder="Search Indian cities (e.g. Mumbai, Delhi)..."
                            className="bg-transparent border-none focus:ring-0 w-full text-primary dark:text-white placeholder:text-primary/45 dark:placeholder:text-white/40 font-bold text-sm focus:outline-none"
                            aria-autocomplete="list"
                            aria-expanded={showCityDropdown}
                        />
                        
                        {/* Autocomplete Suggestions Box */}
                        <AnimatePresence>
                            {showCityDropdown && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-0 right-0 top-full mt-3 bg-white/95 dark:bg-[#001e3c]/95 backdrop-blur-2xl border border-primary/10 dark:border-accent/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto text-left"
                                >
                                    {citySuggestions.length > 0 ? (
                                        citySuggestions.map((city, idx) => (
                                            <button
                                                key={city.name}
                                                type="button"
                                                onClick={() => handleCityClick(city)}
                                                className={`w-full text-left px-6 py-3.5 transition-colors flex items-center justify-between text-sm ${
                                                    idx === activeCityIndex 
                                                    ? 'bg-accent text-white' 
                                                    : 'hover:bg-accent/10 dark:hover:bg-accent/20 text-primary dark:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-accent opacity-75" />
                                                    <span className="font-bold">{city.name}</span>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${idx === activeCityIndex ? 'text-white/80' : 'text-primary/45 dark:text-white/40'}`}>
                                                    {city.state}
                                                </span>
                                            </button>
                                        ))
                                    ) : searchQuery.trim() !== '' ? (
                                        <div className="px-6 py-4 text-center text-xs font-bold text-primary/45 dark:text-white/40">
                                            No matching Indian cities found
                                        </div>
                                    ) : (
                                        <div className="px-6 py-4 text-left text-xs font-bold text-primary/45 dark:text-white/40">
                                            Type to filter major cities...
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Searchable Custom Dropdown Block */}
                    <div ref={locationDropdownRef} className="relative flex-1 flex items-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-primary/10 dark:border-white/10">
                        <button 
                            type="button"
                            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                            className="flex items-center justify-between w-full bg-transparent border-none focus:ring-0 text-primary dark:text-white font-bold text-sm cursor-pointer outline-none py-1"
                        >
                            <div className="flex items-center">
                                <Building2 className="text-primary dark:text-accent w-5 h-5 mr-4 opacity-60 transition-all" />
                                <span className="text-left truncate max-w-[150px]">
                                    {selectedLocation}
                                </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-350 ${showLocationDropdown ? 'rotate-180 text-accent' : ''} opacity-60`} />
                        </button>

                        {/* Location Dropdown Panel */}
                        <AnimatePresence>
                            {showLocationDropdown && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-0 right-0 top-full mt-3 w-full min-w-[280px] md:min-w-[320px] bg-white/95 dark:bg-[#001e3c]/95 backdrop-blur-2xl border border-primary/10 dark:border-accent/20 rounded-2xl shadow-2xl overflow-hidden z-50 text-left"
                                >
                                    {/* Search inside locations list */}
                                    <div className="p-3 border-b border-primary/10 dark:border-white/10">
                                        <input 
                                            type="text"
                                            value={locationSearchQuery}
                                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                                            placeholder="Search region, metro, zone..."
                                            className="w-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-accent/20 rounded-xl px-4 py-2.5 text-xs font-bold text-primary dark:text-white placeholder:text-primary/45 dark:placeholder:text-white/40 focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div className="max-h-60 overflow-y-auto divide-y divide-primary/5 dark:divide-white/5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedLocation('All Locations');
                                                setShowLocationDropdown(false);
                                                setLocationSearchQuery('');
                                            }}
                                            className="w-full text-left px-5 py-3 hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors flex items-center justify-between text-sm text-primary dark:text-white font-bold"
                                        >
                                            All Locations
                                        </button>
                                        
                                        {filteredLocations.length > 0 ? (
                                            filteredLocations.map((loc) => (
                                                <button
                                                    key={loc.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedLocation(loc.name);
                                                        setShowLocationDropdown(false);
                                                        setLocationSearchQuery('');
                                                    }}
                                                    className="w-full text-left px-5 py-3.5 hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors flex items-center justify-between text-sm text-primary dark:text-white"
                                                >
                                                    <span className="font-bold">{loc.name}</span>
                                                    <span className="text-[9px] uppercase tracking-widest font-black text-accent bg-accent/15 dark:bg-accent/20 px-2.5 py-1 rounded-md">
                                                        {loc.type}
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-5 text-center text-xs font-bold text-primary/45 dark:text-white/40">
                                                No location matches found
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Voice Search & Explore Estates Trigger Block */}
                    <div className="flex items-center justify-between md:justify-end gap-3 px-6 py-3 md:py-0 md:pr-2 md:pl-4">
                        <VoiceSearch onResult={(res) => {
                            setSearchQuery(res);
                            setShowCityDropdown(true);
                        }} />
                        <button 
                            onClick={handleExplore}
                            className="flex-1 md:flex-initial bg-primary dark:bg-accent text-white px-8 md:px-10 h-[3.5rem] md:h-[4.5rem] rounded-2xl md:rounded-full font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 group/btn hover:bg-secondary dark:hover:bg-white dark:hover:text-primary shadow-lg shadow-primary/20 dark:shadow-none"
                        >
                            Explore Estates
                            <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Search Results Collapsible Showcase */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            ref={resultsRef}
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full max-w-6xl mt-8 mb-12"
                        >
                            <div className="bg-white/95 dark:bg-[#001e3c]/90 backdrop-blur-xl border border-primary/10 dark:border-accent/25 p-6 md:p-8 rounded-[2rem] shadow-2xl space-y-6">
                                <div className="flex items-center justify-between border-b border-primary/10 dark:border-white/10 pb-4">
                                    <div className="text-left">
                                        <h2 className="text-xl sm:text-2xl font-headline font-black text-primary dark:text-white">
                                            Curated Estates
                                        </h2>
                                        <p className="text-xs text-accent font-bold mt-1">
                                            Showing properties for &ldquo;{searchQuery || selectedLocation}&rdquo;
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowResults(false)}
                                        className="w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-primary dark:text-white transition-colors"
                                        aria-label="Close search results"
                                    >
                                        <X className="w-5 h-5 text-accent" />
                                    </button>
                                </div>

                                {isLoadingEstates ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-accent" />
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent animate-pulse">
                                            Curating Luxury Portfolios...
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {estatesResults.map((estate, idx) => (
                                            <motion.div
                                                key={estate.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group bg-white dark:bg-[#001428]/40 border border-primary/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img 
                                                        src={estate.image} 
                                                        alt={estate.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute top-3 left-3 bg-primary dark:bg-accent text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                                                        {estate.price}
                                                    </div>
                                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                                                        <Star className="w-3 h-3 text-accent fill-accent" />
                                                        <span className="text-[10px] font-black text-primary dark:text-white">{estate.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 text-left flex flex-col flex-1 justify-between space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {estate.tags.slice(0, 2).map((tag, tIdx) => (
                                                                <span key={tIdx} className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <h3 className="font-headline font-black text-base text-primary dark:text-white group-hover:text-accent transition-colors leading-tight">
                                                            {estate.name}
                                                        </h3>
                                                        <p className="text-[10px] font-bold text-primary/45 dark:text-white/40 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3.5 h-3.5 text-accent" />
                                                            {estate.location}
                                                        </p>
                                                        <p className="text-xs text-primary/60 dark:text-white/70 line-clamp-2">
                                                            {estate.description}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-4 pt-3 border-t border-primary/5 dark:border-white/5">
                                                        {/* Specifications */}
                                                        <div className="flex items-center justify-between text-[11px] font-bold text-primary/60 dark:text-white/60">
                                                            <div className="flex items-center gap-1">
                                                                <BedDouble className="w-3.5 h-3.5 text-accent" />
                                                                <span>{estate.bedrooms} Beds</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Bath className="w-3.5 h-3.5 text-accent" />
                                                                <span>{estate.bathrooms} Baths</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Maximize className="w-3.5 h-3.5 text-accent" />
                                                                <span>{estate.area}</span>
                                                            </div>
                                                        </div>

                                                        {/* Inquiry Action */}
                                                        <button 
                                                            onClick={() => setSelectedEstateForInquiry(estate)}
                                                            className="w-full bg-primary/5 hover:bg-accent hover:text-white dark:bg-white/5 dark:hover:bg-accent text-primary dark:text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                                                        >
                                                            Inquire Privately
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Shortcuts */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-wrap justify-center gap-12 pt-8"
                >
                    {[
                        { label: 'Active Collection', value: '3,200+', icon: <Building2 className="w-5 h-5 text-accent" /> },
                        { label: 'Verified Sellers', value: '850+', icon: <Users2 className="w-5 h-5 text-accent" /> },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-accent transition-all">
                                {stat.icon}
                            </div>
                            <div className="text-left">
                                <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            {!showResults && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 p-1 flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-accent rounded-full"
                        />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Discover More</span>
                </motion.div>
            )}

            {/* Private Tour Request Inquiry Modal */}
            <AnimatePresence>
                {selectedEstateForInquiry && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#001e3c] border border-primary/10 dark:border-accent/30 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            {/* Close Modal Button */}
                            <button
                                onClick={() => {
                                    setSelectedEstateForInquiry(null);
                                    setInquirySuccess(false);
                                }}
                                className="absolute top-4 right-4 text-primary/60 dark:text-white/60 hover:text-accent transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {inquirySuccess ? (
                                <div className="text-center py-8 space-y-4">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mx-auto"
                                    >
                                        <CheckCircle2 className="w-8 h-8" />
                                    </motion.div>
                                    <h3 className="font-headline font-black text-xl text-primary dark:text-white">Request Registered</h3>
                                    <p className="text-xs text-primary/60 dark:text-white/60 leading-relaxed px-4">
                                        An elite concierge from RoyalPlots will contact you shortly to schedule your private tour of <strong>{selectedEstateForInquiry.name}</strong>.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-left space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Private Placement Inquiry</span>
                                        <h3 className="font-headline font-black text-xl text-primary dark:text-white">
                                            {selectedEstateForInquiry.name}
                                        </h3>
                                        <p className="text-xs text-primary/45 dark:text-white/40 font-bold">
                                            Est. Value: {selectedEstateForInquiry.price} | {selectedEstateForInquiry.location}
                                        </p>
                                    </div>

                                    <form onSubmit={handleInquirySubmit} className="space-y-4 text-left">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 dark:text-white/60">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-accent" />
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={inquiryName}
                                                    onChange={(e) => setInquiryName(e.target.value)}
                                                    placeholder="Lachlan Sterling"
                                                    className="w-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-accent/20 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-primary dark:text-white placeholder:text-primary/30 dark:placeholder:text-white/30 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 dark:text-white/60">Corporate Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-accent" />
                                                <input 
                                                    type="email" 
                                                    required
                                                    value={inquiryEmail}
                                                    onChange={(e) => setInquiryEmail(e.target.value)}
                                                    placeholder="sterling@luxuryestates.in"
                                                    className="w-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-accent/20 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-primary dark:text-white placeholder:text-primary/30 dark:placeholder:text-white/30 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-primary/60 dark:text-white/60">Contact Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-accent" />
                                                <input 
                                                    type="tel" 
                                                    required
                                                    value={inquiryPhone}
                                                    onChange={(e) => setInquiryPhone(e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-accent/20 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-primary dark:text-white placeholder:text-primary/30 dark:placeholder:text-white/30 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            className="w-full bg-accent hover:bg-accent/80 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-accent/20"
                                        >
                                            Schedule Private Viewing
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
