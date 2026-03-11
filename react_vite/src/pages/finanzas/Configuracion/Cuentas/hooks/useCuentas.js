import { useState, useEffect, useCallback } from 'react';
import {
    getCuentas,
    getCuenta,
    createCuenta,
    updateCuenta,
    deleteCuenta
} from '../../../../../services/cuentasService';

export function useCuentas() {
    // 1. DATA STATE
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingCuenta, setEditingCuenta] = useState(null);

    // 3. INITIAL FORM STATE
    const emptyForm = {
        nombre: '',
        descripcion: '',
        is_active: true
    };

    const [form, setForm] = useState(emptyForm);

    // 4. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const cuentasData = await getCuentas();
            setCuentas(cuentasData || []);
        } catch (err) {
            setError('Error cargando datos');
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
        setEditingCuenta(null);
        setFormError(null);
    }, []);

    const openCreate = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEdit = async (cuenta) => {
        const cuentaDetail = await getCuenta(cuenta.id);
        if (cuentaDetail) {
            setEditingCuenta(cuenta);
            setForm({
                nombre: cuentaDetail.nombre || '',
                descripcion: cuentaDetail.descripcion || '',
                is_active: cuentaDetail.is_active !== undefined ? cuentaDetail.is_active : true
            });
            setFormError(null);
            setModalOpen(true);
        }
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
        if (form.nombre.length > 255) return 'El nombre no puede exceder 255 caracteres';
        if (form.descripcion && form.descripcion.length > 1000) return 'La descripción no puede exceder 1000 caracteres';
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
            const payload = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim() || null,
                is_active: form.is_active
            };

            let result;
            if (editingCuenta) {
                result = await updateCuenta(editingCuenta.id, payload);
            } else {
                result = await createCuenta(payload);
            }

            if (result.success) {
                setFormSuccess(editingCuenta ? 'Cuenta actualizada' : 'Cuenta creada');
                closeModal();
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                // Manejar errores de validación de Laravel
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat();
                    setFormError(errorMessages.join('. '));
                } else {
                    setFormError(result.error || result.message || 'Error guardando');
                }
            }
        } catch (err) {
            setFormError('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (cuenta) => {
        if (!window.confirm(`¿Desactivar cuenta "${cuenta.nombre}"? Dejará de aparecer en el sistema.`)) return;

        try {
            const result = await deleteCuenta(cuenta.id);
            if (result.success) {
                setFormSuccess('Cuenta desactivada');
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                alert(result.error || 'Error desactivando');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    return {
        // Data
        cuentas,
        loading,
        error,

        // UI State
        modalOpen,
        closeModal,
        saving,
        formError,
        setFormError,
        formSuccess,
        setFormSuccess,
        editingCuenta,

        // Forms
        form,
        setForm,
        handleChange,

        // Actions
        openCreate,
        openEdit,
        handleSave,
        handleDelete,
        refetch: fetchData
    };
}
