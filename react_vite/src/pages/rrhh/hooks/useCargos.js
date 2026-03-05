import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    getCargos,
    getCargo,
    createCargo,
    updateCargo,
    deleteCargo
} from '../../../services/cargoService';
import { getPersonal } from '../../../services/personalService';

export function useCargos() {
    // 1. DATA STATE
    const [cargos, setCargos] = useState([]);
    const [personalList, setPersonalList] = useState([]); // Cache de todo el personal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingCargo, setEditingCargo] = useState(null);

    // 3. PERSONAL MODAL STATE
    const [personalModalOpen, setPersonalModalOpen] = useState(false);
    const [selectedCargo, setSelectedCargo] = useState(null);
    const [loadingPersonal, setLoadingPersonal] = useState(false);
    const [personalDelCargo, setPersonalDelCargo] = useState([]);

    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        is_active: true
    });

    // 4. FILTER STATE
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'inactive', 'all'

    // 5. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCargos();
            setCargos(data || []);
            // Pre-fetch personal data for the modal to be snappy, or could fetch on demand
            // For optimization, we'll fetch on demand if list is huge, but here let's fetch on demand.
        } catch (err) {
            setError('Error cargando datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 6. FILTER LOGIC
    const filteredCargos = useMemo(() => {
        return cargos.filter(cargo => {
            // Text Filter (Nombre)
            if (searchText) {
                const searchLower = searchText.toLowerCase();
                if (!cargo.nombre.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Status Filter
            const isActive = cargo.is_active == 1 || cargo.is_active === true;
            if (statusFilter === 'active' && !isActive) return false;
            if (statusFilter === 'inactive' && isActive) return false;

            return true;
        });
    }, [cargos, searchText, statusFilter]);

    // 7. ACTIONS (CRUD)
    const resetForm = useCallback(() => {
        setForm({ nombre: '', descripcion: '', is_active: true });
        setEditingCargo(null);
        setFormError(null);
    }, []);

    const openCreate = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEdit = async (cargo) => {
        const cargoDetail = await getCargo(cargo.id);
        if (cargoDetail) {
            setEditingCargo(cargo);
            setForm({
                nombre: cargoDetail.nombre || '',
                descripcion: cargoDetail.descripcion || '',
                is_active: cargoDetail.is_active
            });
            setFormError(null);
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    // 8. ACTIONS (PERSONAL MODAL)
    const openPersonalModal = async (cargo) => {
        setSelectedCargo(cargo);
        setPersonalModalOpen(true);
        setLoadingPersonal(true);
        try {
            // Fetch personal list if not cached or always fetch fresh?
            // Let's fetch fresh to ensure accuracy
            const allPersonal = await getPersonal();
            
            // Filter by cargo_id
            // Assumes personal object has cargo_id
            const filtered = allPersonal.filter(p => p.cargo_id === cargo.id);
            setPersonalDelCargo(filtered);
        } catch (err) {
            console.error(err);
            setPersonalDelCargo([]);
        } finally {
            setLoadingPersonal(false);
        }
    };

    const closePersonalModal = () => {
        setPersonalModalOpen(false);
        setSelectedCargo(null);
        setPersonalDelCargo([]);
    };

    // 9. HANDLERS
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
            const payload = {
                nombre: form.nombre,
                descripcion: form.descripcion,
                is_active: form.is_active
            };

            let result;
            if (editingCargo) {
                result = await updateCargo(editingCargo.id, payload);
            } else {
                result = await createCargo(payload);
            }

            if (result.success) {
                setFormSuccess(editingCargo ? 'Cargo actualizado' : 'Cargo creado');
                closeModal();
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                setFormError(result.error || result.message || 'Error guardando');
            }
        } catch (err) {
            setFormError('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (cargo) => {
        if (!window.confirm(`¿Eliminar cargo "${cargo.nombre}"?`)) return;

        try {
            const result = await deleteCargo(cargo.id);
            if (result.success) {
                setFormSuccess('Cargo eliminado');
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                alert(result.error || 'Error eliminando');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    return {
        // Data
        cargos,
        filteredCargos,
        loading,
        error,

        // Filters
        searchText,
        setSearchText,
        statusFilter,
        setStatusFilter,

        // UI State (Form)
        modalOpen,
        closeModal,
        saving,
        formError,
        setFormError,
        formSuccess,
        setFormSuccess,
        editingCargo,

        // UI State (Personal Modal)
        personalModalOpen,
        closePersonalModal,
        selectedCargo,
        loadingPersonal,
        personalDelCargo,
        openPersonalModal,

        // Forms
        form,
        handleChange,

        // Actions
        openCreate,
        openEdit,
        handleSave,
        handleDelete,
        refetch: fetchData
    };
}
