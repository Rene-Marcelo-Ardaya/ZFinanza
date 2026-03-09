import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    getNegocios,
    getNegocio,
    createNegocio,
    updateNegocio,
    deleteNegocio
} from '../../../../services/negocioService';

export function useNegocios() {
    // 1. DATA STATE
    const [negocios, setNegocios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingNegocio, setEditingNegocio] = useState(null);

    const [form, setForm] = useState({
        nombre: '',
        is_active: true
    });

    // 3. FILTER STATE
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'inactive', 'all'

    // 4. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNegocios();
            setNegocios(data || []);
        } catch (err) {
            setError('Error cargando datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // 5. FILTER LOGIC
    const filteredNegocios = useMemo(() => {
        return negocios.filter(negocio => {
            // Text Filter (Nombre)
            if (searchText) {
                const searchLower = searchText.toLowerCase();
                if (!negocio.nombre.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Status Filter
            const isActive = negocio.is_active == 1 || negocio.is_active === true;
            if (statusFilter === 'active' && !isActive) return false;
            if (statusFilter === 'inactive' && isActive) return false;

            return true;
        });
    }, [negocios, searchText, statusFilter]);

    // 6. FORM HANDLERS
    const handleChange = useCallback((fieldName) => (e) => {
        const { value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [fieldName]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const openCreate = useCallback(() => {
        setForm({
            nombre: '',
            is_active: true
        });
        setEditingNegocio(null);
        setFormError(null);
        setFormSuccess(null);
        setModalOpen(true);
    }, []);

    const openEdit = useCallback(async (negocio) => {
        setLoading(true);
        try {
            const data = await getNegocio(negocio.id);
            if (data) {
                setForm({
                    nombre: data.nombre || '',
                    is_active: data.is_active ?? true
                });
                setEditingNegocio(data);
                setFormError(null);
                setFormSuccess(null);
                setModalOpen(true);
            }
        } catch (err) {
            setError('Error cargando negocio');
        } finally {
            setLoading(false);
        }
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingNegocio(null);
        setFormError(null);
    }, []);

    const handleSave = useCallback(async () => {
        // Validación
        if (!form.nombre.trim()) {
            setFormError('El nombre es requerido');
            return;
        }

        setSaving(true);
        setFormError(null);
        setFormSuccess(null);

        try {
            const payload = {
                nombre: form.nombre.trim(),
                is_active: form.is_active
            };

            let result;
            if (editingNegocio) {
                result = await updateNegocio(editingNegocio.id, payload);
            } else {
                result = await createNegocio(payload);
            }

            if (result.success) {
                setFormSuccess(editingNegocio ? 'Negocio actualizado correctamente' : 'Negocio creado correctamente');
                await refetch();
                setTimeout(() => {
                    closeModal();
                    setFormSuccess(null);
                }, 1500);
            } else {
                setFormError(result.message || 'Error al guardar');
            }
        } catch (err) {
            setFormError('Error al guardar negocio');
        } finally {
            setSaving(false);
        }
    }, [form, editingNegocio, refetch, closeModal]);

    const handleDelete = useCallback(async (negocio) => {
        if (!window.confirm(`¿Está seguro de eliminar el negocio "${negocio.nombre}"?`)) {
            return;
        }

        try {
            const result = await deleteNegocio(negocio.id);
            if (result.success) {
                await refetch();
            } else {
                setError(result.message || 'Error al eliminar');
            }
        } catch (err) {
            setError('Error al eliminar negocio');
        }
    }, [refetch]);

    return {
        // State
        negocios,
        filteredNegocios,
        loading,
        error,
        modalOpen,
        saving,
        form,
        formError,
        formSuccess,
        editingNegocio,
        searchText,
        statusFilter,

        // Actions
        setSearchText,
        setStatusFilter,
        openCreate,
        openEdit,
        closeModal,
        handleChange,
        handleSave,
        handleDelete,
        refetch,
        setFormSuccess
    };
}
