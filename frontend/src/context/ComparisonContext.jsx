import { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
    const [compareList, setCompareList] = useState(() => {
        const saved = localStorage.getItem('royalplots-compare');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('royalplots-compare', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (property) => {
        if (compareList.length >= 4) return { success: false, message: 'You can compare up to 4 properties.' };
        if (compareList.find(p => p._id === property._id)) return { success: false, message: 'Property already in comparison.' };
        setCompareList([...compareList, property]);
        return { success: true };
    };

    const removeFromCompare = (id) => {
        setCompareList(compareList.filter(p => p._id !== id));
    };

    const clearCompare = () => setCompareList([]);

    return (
        <ComparisonContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </ComparisonContext.Provider>
    );
}

export const useComparison = () => useContext(ComparisonContext);
