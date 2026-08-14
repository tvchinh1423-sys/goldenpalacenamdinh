'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const EstimateContext = createContext({});

export function EstimateProvider({ children }) {
  const [estimateData, setEstimateData] = useState({
    guestCount: 350,
    budgetPerTable: 3500000,
    session: 'Trưa',
    date: '',
    selectedVenues: [], // array of IDs
    selectedPackage: null,
    selectedAddOns: [],
    selectedMenus: []
  });

  // Load from localStorage on mount (optional)
  useEffect(() => {
    const saved = localStorage.getItem('golden_palace_estimate');
    if (saved) {
      try {
        setEstimateData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved estimate', e);
      }
    }
  }, []);

  // Save to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('golden_palace_estimate', JSON.stringify(estimateData));
  }, [estimateData]);

  const updateEstimate = (updates) => {
    setEstimateData(prev => ({ ...prev, ...updates }));
  };

  return (
    <EstimateContext.Provider value={{ estimateData, updateEstimate }}>
      {children}
    </EstimateContext.Provider>
  );
}

export const useEstimate = () => useContext(EstimateContext);
