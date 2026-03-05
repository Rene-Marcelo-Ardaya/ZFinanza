/**
 * @preserve zG9sZGVycyBieSBSZW5lIE1hcmNlbG8gT3J1w7FvIEFyZGF5YSAmIEp1bmlvciBBZ3VpbGFyIExlYcOxb3M=
 * SharedDataContext
 * 
 * Contexto centralizado para datos que se usan en múltiples páginas.
 * OPTIMIZACIÓN: Evita llamadas duplicadas a la API cuando se navega entre páginas.
 * 
 * Los hooks de páginas individuales pueden consumir estos datos en lugar de
 * hacer sus propias llamadas a la API.
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { isAuthenticated } from '../services/authService';
import CONFIG from '../config';

const SharedDataContext = createContext(null);

// Tiempo mínimo entre refetch automáticos (5 minutos)
const STALE_TIME = 5 * 60 * 1000;

export function SharedDataProvider({ children }) {
    // Estado de datos compartidos (personalizable según necesidades)
    const [sharedData, setSharedData] = useState({});

    // Estado de carga
    const [loading, setLoading] = useState(false);
    const [lastFetch, setLastFetch] = useState(null);
    const [error, setError] = useState(null);

    // Cargar todos los datos compartidos
    const fetchAllSharedData = useCallback(async (force = false) => {
        // Si los datos no están obsoletos y no se fuerza, no recargar
        if (!force && lastFetch && (Date.now() - lastFetch) < STALE_TIME) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Implementar la carga de datos compartidos según necesidades específicas
            // Ejemplo: cargar configuración, menús, etc.

            setLastFetch(Date.now());
        } catch (err) {
            setError(err.message || 'Error loading shared data');
            console.error('Error fetching shared data:', err);
        } finally {
            setLoading(false);
        }
    }, [lastFetch]);

    // Cargar datos al autenticarse
    useEffect(() => {
        if (isAuthenticated()) {
            fetchAllSharedData();
        }
    }, []);

    // Función para actualizar datos específicos
    const updateSharedData = useCallback((key, value) => {
        setSharedData(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Función para limpiar datos específicos
    const clearSharedData = useCallback((key) => {
        setSharedData(prev => {
            const newData = { ...prev };
            delete newData[key];
            return newData;
        });
    }, []);

    const value = useMemo(() => ({
        sharedData,
        setSharedData: updateSharedData,
        clearSharedData,
        fetchAllSharedData,
        loading,
        error,
        refetch: () => fetchAllSharedData(true),
    }), [sharedData, loading, error, fetchAllSharedData, updateSharedData, clearSharedData]);

    return (
        <SharedDataContext.Provider value={value}>
            {children}
        </SharedDataContext.Provider>
    );
}

export function useSharedData() {
    const context = useContext(SharedDataContext);
    if (!context) {
        throw new Error('useSharedData must be used within SharedDataProvider');
    }
    return context;
}
