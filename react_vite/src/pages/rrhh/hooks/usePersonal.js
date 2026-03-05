import { useState, useEffect, useCallback } from 'react';
import {
    getPersonal,
    getEmpleado,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado
} from '../../../services/personalService';
import { getCargosActivos } from '../../../services/cargoService';

export function usePersonal() {
    // 1. DATA STATE
    const [personal, setPersonal] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cargoFilter, setCargoFilter] = useState('');

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingEmpleado, setEditingEmpleado] = useState(null);
    const [pinError, setPinError] = useState(null);

    // 3. INITIAL FORM STATE
    const emptyForm = {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        ci: '',
        pin: '',
        pin_confirmation: '',
        fecha_nacimiento: '',
        genero: '',
        direccion: '',
        telefono: '',
        email: '',
        cargo_id: '',
        fecha_ingreso: '',
        fecha_salida: '',
        salario: '',
        tipo_contrato: '',
        observaciones: ''
    };

    const [form, setForm] = useState(emptyForm);

    // 4. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [personalData, cargosData] = await Promise.all([
                getPersonal(),
                getCargosActivos()
            ]);
            setPersonal(personalData || []);
            setCargos(cargosData || []);
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
        setEditingEmpleado(null);
        setFormError(null);
        setPinError(null);
    }, []);

    const openCreate = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEdit = async (empleado) => {
        const empleadoDetail = await getEmpleado(empleado.id);
        if (empleadoDetail) {
            setEditingEmpleado(empleado);
            setForm({
                nombre: empleadoDetail.nombre || '',
                apellido_paterno: empleadoDetail.apellido_paterno || '',
                apellido_materno: empleadoDetail.apellido_materno || '',
                ci: empleadoDetail.ci || '',
                pin: '', // No mostrar PIN actual
                pin_confirmation: '',
                fecha_nacimiento: empleadoDetail.fecha_nacimiento || '',
                genero: empleadoDetail.genero || '',
                direccion: empleadoDetail.direccion || '',
                telefono: empleadoDetail.telefono || '',
                email: empleadoDetail.email || '',
                cargo_id: empleadoDetail.cargo_id || '',
                fecha_ingreso: empleadoDetail.fecha_ingreso || '',
                fecha_salida: empleadoDetail.fecha_salida || '',
                salario: empleadoDetail.salario || '',
                tipo_contrato: empleadoDetail.tipo_contrato || '',
                observaciones: empleadoDetail.observaciones || ''
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
        const value = e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!form.nombre.trim()) return 'El nombre es requerido';
        if (!form.apellido_paterno.trim()) return 'El apellido paterno es requerido';
        if (!form.ci.trim()) return 'El CI es requerido';
        if (!form.cargo_id) return 'El cargo es requerido';
        if (!form.fecha_ingreso) return 'La fecha de ingreso es requerida';

        // PIN requerido solo al crear
        if (!editingEmpleado) {
            if (!form.pin) return 'El PIN es requerido';
            if (form.pin.length !== 4) return 'El PIN debe tener exactamente 4 caracteres';
            if (form.pin !== form.pin_confirmation) return 'Los PINs no coinciden';
        } else {
            // Si se llena PIN en editar, debe coincidir
            if (form.pin) {
                if (form.pin !== form.pin_confirmation) return 'Los PINs no coinciden';
                if (form.pin.length !== 4) return 'El PIN debe tener exactamente 4 caracteres';
            }
        }

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
                ...form,
                cargo_id: parseInt(form.cargo_id),
                salario: form.salario ? parseFloat(form.salario) : null,
                fecha_nacimiento: form.fecha_nacimiento || null,
                fecha_salida: form.fecha_salida || null,
                apellido_materno: form.apellido_materno || null,
                genero: form.genero || null,
                direccion: form.direccion || null,
                telefono: form.telefono || null,
                email: form.email || null,
                tipo_contrato: form.tipo_contrato || null,
                observaciones: form.observaciones || null,
            };

            // No enviar PIN vacío en edición
            if (editingEmpleado && !form.pin) {
                delete payload.pin;
                delete payload.pin_confirmation;
            }

            let result;
            if (editingEmpleado) {
                result = await updateEmpleado(editingEmpleado.id, payload);
            } else {
                result = await createEmpleado(payload);
            }

            if (result.success) {
                setFormSuccess(editingEmpleado ? 'Empleado actualizado' : 'Empleado creado');
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

    const handleDelete = async (empleado) => {
        if (!window.confirm(`¿Desactivar empleado "${empleado.nombre_completo}"? Dejará de aparecer en el sistema.`)) return;

        try {
            const result = await deleteEmpleado(empleado.id);
            if (result.success) {
                setFormSuccess('Empleado desactivado');
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
        personal,
        cargos,
        loading,
        error,
        cargoFilter,
        setCargoFilter,

        // UI State
        modalOpen,
        closeModal,
        saving,
        formError,
        setFormError,
        formSuccess,
        setFormSuccess,
        editingEmpleado,
        pinError,
        setPinError,

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