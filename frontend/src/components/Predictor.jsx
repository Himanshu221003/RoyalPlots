import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import API_URL from '../config/api';

export default function Predictor() {
    const [formData, setFormData] = useState({
        location: 'Roorkee, Uttarakhand',
        area: '1800',
        bedrooms: '3',
        bathrooms: '3'
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch(`${API_URL}/api/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setResult(data);
            } else {
                setError(data.message || 'Prediction failed');
            }
        } catch (err) {
            setError('Could not reach prediction service');
        } finally {
            setLoading(false);
        }
    };

    // Helper to format currency in INR
    const formatCurrency = (val) => {
        if (val >= 10000000) {
            return `₹ ${(val / 10000000).toFixed(2)} Cr`;
        }
        return `₹ ${(val / 100000).toFixed(2)} L`;
    };

    // Calculate chart dimensions
    const getChartPoints = (trends) => {
        if (!trends || trends.length === 0) return '';
        const paddingX = 40;
        const paddingY = 30;
        const width = 450;
        const height = 180;

        const maxVal = Math.max(...trends.map(t => t.value));
        const minVal = Math.min(...trends.map(t => t.value));
        const range = maxVal - minVal || 1;

        const points = trends.map((t, idx) => {
            const x = paddingX + (idx * (width - paddingX * 2) / (trends.length - 1));
            // Invert Y axis for SVGs
            const y = height - paddingY - ((t.value - minVal) * (height - paddingY * 2) / range);
            return `${x},${y}`;
        }).join(' ');

        return points;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Form Card */}
            <div className="bg-surface dark:bg-dark-surface border border-surface-variant/40 dark:border-dark-surface-variant/40 rounded-[2.5rem] p-8 shadow-xl space-y-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        AI Valuation Engine
                    </div>
                    <h2 className="font-headline font-black text-3xl text-primary dark:text-white tracking-tight">Estimate Future Value</h2>
                    <p className="text-xs font-bold text-on-surface-variant/60 dark:text-dark-on-surface-variant/60">Input property specifications to train the regression model and project market returns.</p>
                </div>

                <form onSubmit={handlePredict} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 dark:text-dark-on-surface-variant/50">Location / Neighborhood</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-2xl bg-surface-variant/10 dark:bg-dark-surface-variant/10 border border-surface-variant/30 text-xs font-black uppercase tracking-wider text-primary focus:outline-none focus:border-accent"
                        >
                            <option value="Thar Desert Sand Dunes, Rajasthan">Thar Desert Sand Dunes, Rajasthan</option>
                            <option value="Roorkee, Uttarakhand">Roorkee, Uttarakhand</option>
                            <option value="Laccadive Sea, Lakshadweep">Laccadive Sea, Lakshadweep</option>
                            <option value="Cyber-Hub Sector 24, Gurugram">Cyber-Hub Sector 24, Gurugram</option>
                            <option value="Silent Valley Forest, Kerala">Silent Valley Forest, Kerala</option>
                            <option value="Spiti Valley, Himachal Pradesh">Spiti Valley, Himachal Pradesh</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 dark:text-dark-on-surface-variant/50">Area (Sq. Ft.)</label>
                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 1500"
                            className="w-full px-6 py-4 rounded-2xl bg-surface-variant/10 dark:bg-dark-surface-variant/10 border border-surface-variant/30 text-xs font-black text-primary focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 dark:text-dark-on-surface-variant/50">Bedrooms</label>
                            <input
                                type="number"
                                name="bedrooms"
                                min="1"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-surface-variant/10 dark:bg-dark-surface-variant/10 border border-surface-variant/30 text-xs font-black text-primary focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 dark:text-dark-on-surface-variant/50">Bathrooms</label>
                            <input
                                type="number"
                                name="bathrooms"
                                min="1"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-surface-variant/10 dark:bg-dark-surface-variant/10 border border-surface-variant/30 text-xs font-black text-primary focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary hover:bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Analyzing Market...' : 'Run Estimate'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {error && <div className="p-4 bg-error/10 border border-error/20 text-error font-bold text-xs rounded-2xl text-center">{error}</div>}
            </div>

            {/* Prediction Output Display */}
            <div className="h-full flex flex-col justify-between">
                {result ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface dark:bg-dark-surface border border-surface-variant/40 dark:border-dark-surface-variant/40 rounded-[2.5rem] p-8 shadow-xl space-y-6 flex-1 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="font-headline font-black text-xl text-primary dark:text-white uppercase tracking-wider">Estimated Valuation</h3>
                                <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{result.location}</p>
                            </div>
                            <div className="px-4 py-2 bg-success/10 text-success border border-success/10 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                {result.isFallbackUsed ? 'Estimated' : 'ML Verified'}
                            </div>
                        </div>

                        {/* Dial value */}
                        <div className="text-center py-6 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-[2rem] border border-primary/5 relative overflow-hidden">
                            <DollarSign className="absolute -right-6 -bottom-6 w-32 h-32 text-primary/5 select-none" />
                            <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Current Projected Value</div>
                            <div className="text-4xl sm:text-5xl font-black text-primary dark:text-dark-primary mt-2 tracking-tight">
                                {formatCurrency(result.predictedPrice)}
                            </div>
                            <div className="text-xs font-bold text-success flex items-center justify-center gap-1.5 mt-2">
                                <TrendingUp className="w-4 h-4" />
                                Growth Potential: +{result.growthRatePercent}% CAGR
                            </div>
                        </div>

                        {/* Projection Chart */}
                        <div className="space-y-4">
                            <h4 className="font-headline font-black text-xs text-primary dark:text-white uppercase tracking-wider">5-Year Growth Projection</h4>
                            
                            <div className="relative bg-surface dark:bg-dark-surface rounded-2xl border border-surface-variant/30 p-2">
                                <svg viewBox="0 0 450 180" className="w-full h-auto overflow-visible">
                                    {/* Grids */}
                                    <line x1="40" y1="30" x2="410" y2="30" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />
                                    <line x1="40" y1="90" x2="410" y2="90" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />
                                    <line x1="40" y1="150" x2="410" y2="150" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3 3" />

                                    {/* Line Graph */}
                                    <polyline
                                        fill="none"
                                        stroke="#B8860B"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={getChartPoints(result.trends)}
                                    />

                                    {/* Markers and text */}
                                    {result.trends.map((t, idx) => {
                                        const paddingX = 40;
                                        const paddingY = 30;
                                        const width = 450;
                                        const height = 180;
                                        const maxVal = Math.max(...result.trends.map(tr => tr.value));
                                        const minVal = Math.min(...result.trends.map(tr => tr.value));
                                        const range = maxVal - minVal || 1;

                                        const x = paddingX + (idx * (width - paddingX * 2) / (result.trends.length - 1));
                                        const y = height - paddingY - ((t.value - minVal) * (height - paddingY * 2) / range);

                                        return (
                                            <g key={idx}>
                                                <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#B8860B" strokeWidth="2.5" />
                                                <text x={x} y={y - 12} fontSize="9" fontWeight="900" textAnchor="middle" fill="#1A1F2C">
                                                    {formatCurrency(t.value).replace('₹', '').trim()}
                                                </text>
                                                <text x={x} y="170" fontSize="8" fontWeight="800" textAnchor="middle" fill="#6B7280">
                                                    {t.year}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-surface dark:bg-dark-surface border border-surface-variant/45 dark:border-dark-surface-variant/45 rounded-[2.5rem] p-8 shadow-xl flex-1 flex flex-col items-center justify-center text-center py-20">
                        <HelpCircle className="w-16 h-16 text-primary/10 dark:text-white/10 mb-4" />
                        <h3 className="font-headline font-black text-xl text-primary dark:text-white uppercase tracking-wider">No Prediction Run</h3>
                        <p className="text-xs font-bold text-on-surface-variant/40 dark:text-dark-on-surface-variant/40 max-w-xs mt-2 leading-relaxed">Fill out the specifications form and click "Run Estimate" to see AI analytics and value projections.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
