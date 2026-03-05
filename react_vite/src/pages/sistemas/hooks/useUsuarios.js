import { useState, useEffect, useCallback } from 'react';
import { getUsers, getRolesList, createUser, updateUser, deleteUser } from '../../../services/userService';
import { getPersonalCombo } from '../../../services/personalService';

export function useUsuarios() {
    // 1. DATA STATE
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    // 3. INITIAL FORM STATE
    const emptyForm = {
        name: '',
        email: '',
        password: '',
        role_id: '',
        id_personal: '',
        is_active: true
    };

    const [form, setForm] = useState(emptyForm);

    // 4.1 FILTERS STATE
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'all', 'inactive'

    // 4. Fetching
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, rolesRes, personalRes] = await Promise.all([
                getUsers(), 
                getRolesList(), 
                getPersonalCombo()
            ]);
            setUsers(usersRes || []);
            setRoles(rolesRes || []);
            setPersonal(personalRes || []);
        } catch (err) {
            setError('Error cargando datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 4.2 FILTER LOGIC
    const filteredUsers = users.filter(user => {
        // 1. Text Filter
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            const nameMatch = user.name?.toLowerCase().includes(searchLower);
            const emailMatch = user.email?.toLowerCase().includes(searchLower);
            
            // Buscar en personal (La lista personal es un combo {value, label})
            const personalData = personal.find(p => p.value == user.id_personal);
            const pName = personalData?.label || '';
            const personalMatch = pName.toLowerCase().includes(searchLower);

            if (!nameMatch && !emailMatch && !personalMatch) return false;
        }

        // 2. Role Filter (comparación laxa)
        if (roleFilter && user.role_id != roleFilter) {
            return false;
        }

        // 3. Status Filter
        const isActive = user.is_active == 1 || user.is_active === true || user.is_active === 'Activo';
        if (statusFilter === 'active' && !isActive) return false;
        if (statusFilter === 'inactive' && isActive) return false;

        return true;
    });

    // 5. ACTIONS
    const resetForm = useCallback(() => {
        setForm(emptyForm);
        setEditingUser(null);
        setFormError(null);
    }, []);

    const openCreate = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.role_id || '',
            id_personal: user.id_personal || '',
            is_active: user.is_active == 1 || user.is_active === true || user.is_active === 'Activo'
        });
        setFormError(null);
        setModalOpen(true);
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
        if (!form.name.trim()) return 'El nombre es requerido';
        if ((form.email || '').trim() && !(form.email || '').includes('@')) return 'Email inválido';
        if (!editingUser && !form.password) return 'La contraseña es requerida';
        if (!form.role_id) return 'Debe seleccionar un rol';
        if (!form.id_personal) return 'Debe seleccionar un personal';
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
                name: form.name,
                email: form.email,
                role_id: parseInt(form.role_id),
                id_personal: form.id_personal ? parseInt(form.id_personal) : null,
                is_active: form.is_active
            };

            if (form.password) {
                payload.password = form.password;
            }

            let result;
            if (editingUser) {
                result = await updateUser(editingUser.id, payload);
            } else {
                result = await createUser(payload);
            }

            if (result.success) {
                setFormSuccess(editingUser ? 'Usuario actualizado' : 'Usuario creado');
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

    const handleDelete = async (user) => {
        if (!window.confirm(`¿Estás seguro de desactivar al usuario "${user.name}"?`)) return;

        try {
            // En lugar de borrar, actualizamos is_active a false
            const payload = {
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                id_personal: user.id_personal,
                is_active: false
            };

            const result = await updateUser(user.id, payload);
            
            if (result.success) {
                setFormSuccess('Usuario desactivado correctamente');
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                alert(result.error || result.message || 'Error al desactivar usuario');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión al intentar desactivar');
        }
    };

    return {
        // Data
        users,
        filteredUsers,
        roles,
        personal,
        loading,
        error,

        // Filters
        searchText,
        setSearchText,
        roleFilter,
        setRoleFilter,
        statusFilter,
        setStatusFilter,

        // UI State
        modalOpen,
        closeModal,
        saving,
        formError,
        setFormError,
        formSuccess,
        setFormSuccess,
        editingUser,

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
