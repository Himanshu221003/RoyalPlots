import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your RoyalPlots AI Assistant. How can I help you find your dream property today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const chatRef = useRef(null);

    const [properties, setProperties] = useState([]);
    const [session, setSession] = useState({
        step: 'idle', // 'idle' | 'awaiting_budget' | 'awaiting_location'
        location: null,
        budget: null,
        category: null
    });

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch(`${API_URL}/api/properties`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.properties) {
                        setProperties(data.properties);
                    }
                }
            } catch (err) {
                console.error('Error fetching chatbot properties:', err);
            }
        };
        fetchProperties();
    }, []);

    const addBotMessage = (text) => {
        const botMsg = { id: Date.now() + Math.random(), text, sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
    };

    const recommendProperties = (sessionData) => {
        const { location, budget, category } = sessionData;

        let filtered = properties;

        if (location) {
            filtered = filtered.filter(p => 
                p.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (budget) {
            filtered = filtered.filter(p => p.price <= budget);
        }

        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }

        if (filtered.length === 0) {
            let msg = `I couldn't find any direct matches in ${location.charAt(0).toUpperCase() + location.slice(1)}`;
            if (budget) msg += ` under ₹${budget.toLocaleString()}`;
            msg += ". However, you can check all our properties on the 'Explore' page or try a different budget/location!";
            addBotMessage(msg);
        } else {
            const count = filtered.length;
            addBotMessage(`I found ${count} matching propert${count > 1 ? 'ies' : 'y'} in ${location.charAt(0).toUpperCase() + location.slice(1)}:`);
            
            filtered.forEach(p => {
                const propMsg = {
                    id: Date.now() + Math.random(),
                    sender: 'bot',
                    text: p.title,
                    property: p
                };
                setMessages(prev => [...prev, propMsg]);
            });
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');

        setTimeout(() => {
            generateBotResponse(currentInput);
        }, 800);
    };

    const generateBotResponse = (query) => {
        const q = query.toLowerCase();
        
        const locations = [
            { key: 'roorkee', names: ['roorkee', 'rookee', 'roorki', 'uttarakhand'] },
            { key: 'indore', names: ['indore', 'madhya pradesh', 'mp'] },
            { key: 'bhopal', names: ['bhopal'] },
            { key: 'rajasthan', names: ['rajasthan', 'desert', 'thar'] },
            { key: 'kerala', names: ['kerala', 'silent valley'] },
            { key: 'spiti', names: ['spiti', 'himachal'] },
            { key: 'gurugram', names: ['gurugram', 'gurgaon', 'delhi'] },
            { key: 'lakshadweep', names: ['lakshadweep', 'laccadive', 'sea'] }
        ];

        let detectedLocation = null;
        for (const loc of locations) {
            if (loc.names.some(name => q.includes(name))) {
                detectedLocation = loc.key;
                break;
            }
        }

        const parseBudget = (str) => {
            const matches = str.match(/([\d.]+)\s*(cr|crore|l|lakh|k)?/i);
            if (!matches) return null;
            const value = parseFloat(matches[1]);
            const unit = (matches[2] || '').toLowerCase();
            if (unit.startsWith('cr')) return value * 10000000;
            if (unit.startsWith('l')) return value * 100000;
            if (unit.startsWith('k')) return value * 1000;
            if (value <= 100) return value * 10000000;
            return value;
        };

        const detectedBudget = parseBudget(q);

        let detectedCategory = null;
        if (q.includes('rent') || q.includes('lease')) detectedCategory = 'rent';
        else if (q.includes('buy') || q.includes('purchase') || q.includes('sale')) detectedCategory = 'buy';

        if (q.includes('reset') || q.includes('restart') || q.includes('clear')) {
            setSession({ step: 'idle', location: null, budget: null, category: null });
            addBotMessage("Okay, let's start over! What area or budget are you looking for?");
            return;
        }

        setSession(prevSession => {
            let updatedSession = { ...prevSession };

            if (prevSession.step === 'awaiting_budget') {
                if (detectedBudget) {
                    updatedSession = { ...prevSession, budget: detectedBudget, step: 'idle' };
                    recommendProperties(updatedSession);
                } else {
                    addBotMessage("I didn't quite catch the budget. Could you specify it? E.g., '1 Cr' or '28000'.");
                }
                return updatedSession;
            }

            if (prevSession.step === 'awaiting_location') {
                if (detectedLocation) {
                    updatedSession = { ...prevSession, location: detectedLocation, step: 'idle' };
                    recommendProperties(updatedSession);
                } else {
                    addBotMessage("Please specify a location (e.g., Roorkee, Indore, Bhopal, Spiti).");
                }
                return updatedSession;
            }

            if (q.includes('price') || q.includes('budget') || q.includes('range')) {
                updatedSession.step = 'awaiting_budget';
                addBotMessage("Our properties range from ₹50L to ₹50Cr+. What is your preferred budget range?");
                return updatedSession;
            }

            if (detectedLocation || q.includes('suggest') || q.includes('find') || q.includes('show') || q.includes('room') || q.includes('house') || q.includes('villa') || q.includes('property') || q.includes('flat')) {
                const loc = detectedLocation || prevSession.location;
                const budget = detectedBudget || prevSession.budget;
                const category = detectedCategory || prevSession.category;

                updatedSession = {
                    step: 'idle',
                    location: loc,
                    budget: budget,
                    category: category
                };

                if (!loc) {
                    updatedSession.step = 'awaiting_location';
                    addBotMessage("Which location are you interested in? (We have listings in Roorkee, Indore, Bhopal, Kerala, Rajasthan, Spiti, Gurugram, and Lakshadweep.)");
                    return updatedSession;
                }

                if (!budget) {
                    updatedSession.step = 'awaiting_budget';
                    addBotMessage(`Perfect! I'll look for properties in ${loc.charAt(0).toUpperCase() + loc.slice(1)}. What is your budget range (e.g. '1 Cr' or '30000')?`);
                    return updatedSession;
                }

                recommendProperties(updatedSession);
                return updatedSession;
            }

            if (q.includes('contact') || q.includes('agent') || q.includes('call') || q.includes('email')) {
                addBotMessage("You can contact our expert team at contact@royalplots.com or call +91 8541974985. You can also view all agents on the 'Agents' page.");
                return updatedSession;
            }

            if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
                addBotMessage("Hello! I'm your RoyalPlots AI Assistant. How can I help you find your dream property today?");
                return updatedSession;
            }

            addBotMessage("That's interesting! I can help you find properties based on location, budget, or type. What are you looking for exactly? (Or type 'restart' to clear filters)");
            return updatedSession;
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-dark-surface rounded-[2.5rem] shadow-2xl border border-surface-variant dark:border-dark-surface-variant flex flex-col overflow-hidden mb-6"
                    >
                        {/* Header */}
                        <div className="bg-primary dark:bg-dark-primary p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-black text-sm tracking-tight">RoyalPlots AI Assistant</p>
                                    <p className="text-[10px] font-bold opacity-60">Online & Ready to Help</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-variant/30 dark:bg-dark-surface-variant/30 text-on-surface dark:text-dark-on-surface rounded-tl-none'}`}>
                                        {msg.property ? (
                                            <div className="space-y-2 text-left">
                                                <p className="font-black leading-tight">{msg.property.title}</p>
                                                <p className="text-[10px] font-bold opacity-60">
                                                    {msg.property.bedrooms} BHK | {msg.property.area} SQFT | {msg.property.location.split(',')[0]}
                                                </p>
                                                <p className="text-xs font-black text-secondary dark:text-accent">
                                                    {msg.property.category === 'rent' ? `₹ ${msg.property.price.toLocaleString()}/month` : `₹ ${(msg.property.price / 10000000).toFixed(2)} Cr`}
                                                </p>
                                                <Link 
                                                    to={`/property/${msg.property._id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block text-center bg-primary dark:bg-dark-primary text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-secondary transition-colors mt-2"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-surface-variant/10 dark:bg-dark-surface-variant/10 border-t border-surface-variant dark:border-dark-surface-variant">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="w-full bg-white dark:bg-dark-surface border border-surface-variant dark:border-dark-surface-variant rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary outline-none"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 w-9 h-9 bg-primary dark:bg-dark-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 relative group"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
                {!isOpen && <span className="absolute -top-2 -right-2 bg-accent w-5 h-5 rounded-full border-4 border-background dark:border-dark-bg animate-bounce" />}
            </motion.button>
        </div>
    );
}
