import { useState, useEffect, useCallback } from 'react';
import {
    getAllSettings,
    updateSetting,
    bulkUpdateSettings
} from '../../../../services/settingService';

export function useConfiguracion() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState({});
    const [success, setSuccess] = useState(null);
    const [iframeKey, setIframeKey] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllSettings();
            setSettings(data);
        } catch (err) {
            setError('Error cargando configuración');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Convert keys to flat object for easy access
    const flatSettings = {};
    Object.values(settings).forEach(group => {
        group.forEach(item => {
            flatSettings[item.key] = item;
        });
    });

    const handleSave = async (key, value) => {
        setSaving(prev => ({ ...prev, [key]: true }));
        const result = await updateSetting(key, value);
        setSaving(prev => ({ ...prev, [key]: false }));

        if (result.success) {
            setSuccess('Configuración guardada');
            setIframeKey(k => k + 1);
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } else {
            setError(result.error || 'Error guardando');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleUpload = async (key, file) => {
        setSaving(prev => ({ ...prev, [key]: true }));
        // Funcionalidad comentada por falta de endpoint
        // const result = await uploadSettingImage(key, file);
        const result = { success: false, error: 'Funcionalidad de subida no implementada en la base.' };
        setSaving(prev => ({ ...prev, [key]: false }));

        if (result.success) {
            setSuccess('Imagen actualizada');
            setIframeKey(k => k + 1);
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } else {
            setError(result.error || 'Error subiendo imagen');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteImage = async (key) => {
        setSaving(prev => ({ ...prev, [key]: true }));
        // Funcionalidad comentada por falta de endpoint
        // const result = await deleteSettingImage(key);
        const result = { success: false, error: 'Funcionalidad no implementada en la base.' };
        setSaving(prev => ({ ...prev, [key]: false }));

        if (result.success) {
            setSuccess('Imagen eliminada');
            setIframeKey(k => k + 1);
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } else {
            setError(result.error || 'Error eliminando imagen');
            setTimeout(() => setError(null), 5000);
        }
    };

    return {
        settings,
        flatSettings,
        loading,
        error,
        setError,
        saving,
        success,
        setSuccess,
        iframeKey,
        refetch: fetchData,
        handleSave,
        handleUpload,
        handleDeleteImage
    };
}
