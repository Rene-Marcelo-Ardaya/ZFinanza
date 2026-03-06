import { useState, useEffect, useCallback } from 'react';
import {
    fetchNiveles,
    createNivel,
    updateNivel,
    deleteNivel
} from '../../../../services/securityLevelService';

export function useNivelesSeguridad() {
    // 1. DATA STATE
    const [niveles, setNiveles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [miembrosModalOpen, setMiembrosModalOpen] = useState(false);
    const [selectedNivel, setSelectedNivel] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingNivel, setEditingNivel] = useState(null);

    // 3. INITIAL FORM STATE
    const emptyForm = {
        nombre: '',
        color: '#3b82f6',
        descripcion: '',
        is_active: true,
    };

    const [form, setForm] = useState(emptyForm);

    // 4. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchNiveles();
            if (result.success) {
                setNiveles(result.data || []);
            } else {
                setError('Error cargando niveles');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 5. ACTIONS
    const resetForm = useCallback(() => {
        setForm(emptyForm);
        setEditingNivel(null);
        setFormError(null);
    }, []);

    const openCreate = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEdit = (nivel) => {
        setEditingNivel(nivel);
        setForm({
            nombre: nivel.nombre || '',
            color: nivel.color || '#6b7280',
            descripcion: nivel.descripcion || '',
            is_active: nivel.is_active === true || nivel.is_active == 1,
        });
        setFormError(null);
        setModalOpen(true);
    };

    const openMiembros = (nivel) => {
        setSelectedNivel(nivel);
        setMiembrosModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    // 6. HANDLERS
    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!form.nombre.trim()) return 'El nombre es requerido';
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        setSaving(true);
        setFormError(null);

        try {
            let result;
            if (editingNivel) {
                result = await updateNivel(editingNivel.id, form);
            } else {
                result = await createNivel(form);
            }

            if (result.success) {
                setFormSuccess(editingNivel ? 'Grupo actualizado' : 'Grupo creado');
                closeModal();
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                setFormError(result.message || 'Error guardando');
            }
        } catch (err) {
            setFormError('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (nivel) => {
        if (nivel.personal_count > 0) {
            alert('No se puede eliminar: hay empleados asignados a este grupo');
            return;
        }
        if (!window.confirm(`¿Eliminar grupo "${nivel.nombre}"?`)) return;

        try {
            const result = await deleteNivel(nivel.id);
            if (result.success) {
                setFormSuccess('Grupo eliminado');
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                alert(result.message || 'Error eliminando');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    return {
        // Data
        niveles,
        loading,
        error,

        // UI State
        modalOpen,
        closeModal,
        miembrosModalOpen,
        setMiembrosModalOpen,
        selectedNivel,
        saving,
        formError,
        setFormError,
        formSuccess,
        setFormSuccess,
        editingNivel,

        // Forms
        form,
        setForm,
        handleChange,

        // Actions
        openCreate,
        openEdit,
        openMiembros,
        handleSave,
        handleDelete,
        refetch: fetchData
    };
}
