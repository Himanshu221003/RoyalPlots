const Property = require('../models/Property');

// Helper to clean and parse area
const parseArea = (areaStr) => {
    if (!areaStr) return 1000;
    return parseFloat(areaStr.toString().replace(/,/g, '')) || 1000;
};

// Fallback rule-based pricing based on typical market rates per sq ft
const getFallbackPrice = (location, area, bedrooms, bathrooms) => {
    let pricePerSqFt = 7000; // default
    const loc = location.toLowerCase();

    if (loc.includes('gurugram') || loc.includes('cyber-hub')) pricePerSqFt = 12000;
    else if (loc.includes('lakshadweep') || loc.includes('sea')) pricePerSqFt = 15000;
    else if (loc.includes('rajasthan') || loc.includes('desert')) pricePerSqFt = 5500;
    else if (loc.includes('uttarakhand') || loc.includes('mountain') || loc.includes('roorkee')) pricePerSqFt = 8500;
    else if (loc.includes('kerala') || loc.includes('forest')) pricePerSqFt = 6500;
    else if (loc.includes('spiti') || loc.includes('valley')) pricePerSqFt = 5000;

    const basePrice = area * pricePerSqFt;
    const roomPremium = (bedrooms * 300000) + (bathrooms * 150000);
    return Math.round(basePrice + roomPremium);
};

// @desc    Predict property price using Multivariate Linear Regression (Gradient Descent)
// @route   POST /api/predict
// @access  Public
const predictPrice = async (req, res) => {
    try {
        const { location, area: areaInput, bedrooms, bathrooms } = req.body;

        if (!location || !areaInput || !bedrooms || !bathrooms) {
            return res.status(400).json({ message: 'Please provide all details (location, area, bedrooms, bathrooms)' });
        }

        const areaVal = parseFloat(areaInput);
        const bedVal = parseFloat(bedrooms);
        const bathVal = parseFloat(bathrooms);

        // 1. Fetch approved properties for training
        const properties = await Property.find({ status: 'Approved' });

        let predictedPrice = 0;
        let isFallbackUsed = true;
        let cagr = 0.07; // default 7% growth rate

        // Set CAGR based on location demand
        const locLower = location.toLowerCase();
        if (locLower.includes('gurugram') || locLower.includes('cyber-hub')) cagr = 0.12; // 12%
        else if (locLower.includes('lakshadweep')) cagr = 0.09;
        else if (locLower.includes('uttarakhand')) cagr = 0.08;
        else if (locLower.includes('rajasthan')) cagr = 0.06;

        if (properties.length >= 3) {
            // We have enough data to run a regression model
            isFallbackUsed = false;

            // Extract training inputs and targets
            // Features: [area, bedrooms, bathrooms, location_multiplier]
            // We calculate location_multiplier as the average price/sqft for that location
            const locAverages = {};
            properties.forEach(p => {
                const locKey = p.location.split(',').pop().trim().toLowerCase();
                const pArea = parseArea(p.area);
                const pricePerSqFt = p.price / pArea;

                if (!locAverages[locKey]) {
                    locAverages[locKey] = { total: 0, count: 0 };
                }
                locAverages[locKey].total += pricePerSqFt;
                locAverages[locKey].count += 1;
            });

            const getLocMultiplier = (locName) => {
                const locKey = locName.split(',').pop().trim().toLowerCase();
                if (locAverages[locKey]) {
                    return locAverages[locKey].total / locAverages[locKey].count;
                }
                // Global average price/sqft as default multiplier
                let totalSqFtPrice = 0;
                properties.forEach(p => { totalSqFtPrice += p.price / parseArea(p.area); });
                return totalSqFtPrice / properties.length;
            };

            const X = [];
            const y = [];

            properties.forEach(p => {
                const area = parseArea(p.area);
                const multiplier = getLocMultiplier(p.location);
                X.push([area, p.bedrooms, p.bathrooms, multiplier]);
                y.push(p.price);
            });

            // Normalization variables (Min-Max Scaling)
            const minX = [Infinity, Infinity, Infinity, Infinity];
            const maxX = [-Infinity, -Infinity, -Infinity, -Infinity];
            const minY = Math.min(...y);
            const maxY = Math.max(...y);

            // Find min-max for scaling
            for (let i = 0; i < X.length; i++) {
                for (let j = 0; j < 4; j++) {
                    if (X[i][j] < minX[j]) minX[j] = X[i][j];
                    if (X[i][j] > maxX[j]) maxX[j] = X[i][j];
                }
            }

            // Avoid division by zero if all values are identical
            const rangeX = maxX.map((val, idx) => (val - minX[idx]) || 1);
            const rangeY = (maxY - minY) || 1;

            // Normalize training data
            const X_norm = X.map(row => row.map((val, idx) => (val - minX[idx]) / rangeX[idx]));
            const y_norm = y.map(val => (val - minY) / rangeY);

            // Train Linear Regression using Gradient Descent
            let w = [0, 0, 0, 0];
            let b = 0;
            const learningRate = 0.1;
            const epochs = 1000;
            const M = X_norm.length;

            for (let epoch = 0; epoch < epochs; epoch++) {
                let dw = [0, 0, 0, 0];
                let db = 0;

                for (let i = 0; i < M; i++) {
                    let pred = b;
                    for (let j = 0; j < 4; j++) {
                        pred += w[j] * X_norm[i][j];
                    }
                    const error = pred - y_norm[i];
                    db += error;
                    for (let j = 0; j < 4; j++) {
                        dw[j] += error * X_norm[i][j];
                    }
                }

                // Update parameters
                b -= (learningRate * db) / M;
                for (let j = 0; j < 4; j++) {
                    w[j] -= (learningRate * dw[j]) / M;
                }
            }

            // Make prediction for user inputs
            const userMultiplier = getLocMultiplier(location);
            const userFeatures = [areaVal, bedVal, bathVal, userMultiplier];

            // Normalize user features
            const userFeaturesNorm = userFeatures.map((val, idx) => {
                // Handle out of bounds features gracefully
                let normVal = (val - minX[idx]) / rangeX[idx];
                return Math.max(-0.5, Math.min(1.5, normVal)); // constrain scaling slightly
            });

            // Calculate normalized price
            let predictedNormPrice = b;
            for (let j = 0; j < 4; j++) {
                predictedNormPrice += w[j] * userFeaturesNorm[j];
            }

            // Inverse normalization
            predictedPrice = Math.round(predictedNormPrice * rangeY + minY);

            // Bounds check
            const fallbackVal = getFallbackPrice(location, areaVal, bedVal, bathVal);
            if (predictedPrice <= 0 || predictedPrice > fallbackVal * 3 || predictedPrice < fallbackVal * 0.3) {
                predictedPrice = fallbackVal;
                isFallbackUsed = true;
            }
        } else {
            // Fallback
            predictedPrice = getFallbackPrice(location, areaVal, bedVal, bathVal);
        }

        // 2. Generate 5-year price projections
        const trends = [];
        const currentYear = new Date().getFullYear();

        for (let i = 0; i <= 5; i++) {
            const year = currentYear + i;
            const estimatedValue = Math.round(predictedPrice * Math.pow(1 + cagr, i));
            trends.push({ year, value: estimatedValue });
        }

        res.json({
            success: true,
            location,
            area: areaVal,
            bedrooms: bedVal,
            bathrooms: bathVal,
            predictedPrice,
            isFallbackUsed,
            growthRatePercent: Math.round(cagr * 100),
            trends
        });

    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ message: 'Error estimating property price' });
    }
};

module.exports = { predictPrice };
