import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    getRoles,
    getMenusList,
    getRole,
    createRole,
    updateRole,
    deleteRole
} from '../../../services/roleService';
import { getUsers } from '../../../services/userService';

export function useControlAccesos() {
    // 1. DATA STATE
    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingRole, setEditingRole] = useState(null);

    // 3. CONSULTATION MODALS STATE
    // Menus
    const [menusModalOpen, setMenusModalOpen] = useState(false);
    const [selectedRoleForMenus, setSelectedRoleForMenus] = useState(null);
    const [roleMenus, setRoleMenus] = useState([]); // List of allowed menu IDs for the viewer
    
    // Users
    const [usersModalOpen, setUsersModalOpen] = useState(false);
    const [selectedRoleForUsers, setSelectedRoleForUsers] = useState(null);
    const [roleUsers, setRoleUsers] = useState([]);
    const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);

    // 4. FILTER STATE
    const [searchText, setSearchText] = useState('');

    // 5. INITIAL FORM STATE
    const emptyForm = {
        name: '',
        slug: '',
        description: '',
        is_active: true,
        menu_ids: [],
        session_timeout_minutes: ''
    };

    const [form, setForm] = useState(emptyForm);

    // 6. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [rolesRes, menusRes] = await Promise.all([getRoles(), getMenusList()]);
            setRoles(rolesRes || []);
            setMenus(menusRes || []);
        } catch (err) {
            setError('Error cargando datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 7. FILTER LOGIC
    const filteredRoles = useMemo(() => {
        if (!searchText) return roles;
        const lowerTerm = searchText.toLowerCase();
        return roles.filter(role => 
            role.name.toLowerCase().includes(lowerTerm) ||
            (role.description || '').toLowerCase().includes(lowerTerm)
        );
    }, [roles, searchText]);

    // 8. ACTIONS (CRUD)
    const resetForm = useCallback(() => {
        setForm(emptyForm);
        setEditingRole(null);
        setFormError(null);
    }, []);

    const openCreate = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEdit = async (role) => {
        const roleDetail = await getRole(role.id);
        if (roleDetail) {
            setEditingRole(role);
            setForm({
                name: roleDetail.name,
                slug: roleDetail.slug,
                description: roleDetail.description || '',
                is_active: roleDetail.is_active == 1 || roleDetail.is_active === true,
                menu_ids: roleDetail.menu_ids || [],
                session_timeout_minutes: roleDetail.session_timeout_minutes ?? ''
            });
            setFormError(null);
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    // 9. ACTIONS (CONSULTATION MODALS)
    const openMenusModal = async (role) => {
        setSelectedRoleForMenus(role);
        // El rol en la lista ya debería tener menu_ids si la API lo devuelve, 
        // pero mejor asegurar pidiendo el detalle o confiando en lo que tenemos.
        // Si 'role.menu_ids' no viene en la lista 'getRoles', habría que hacer fetch como en openEdit.
        // Asumiremos que vamos a hacer fetch para asegurar datos frescos.
        setLoading(true); // Reusamos loading general o uno especifico? mejor uno especifico si fuera necesario, pero el modal controla su loading via props
        
        try {
            // Nota: getRole devuelve el detalle completo incluyendo menú ids
            const roleDetail = await getRole(role.id);
            setRoleMenus(roleDetail?.menu_ids || []);
            setMenusModalOpen(true);
        } catch(err) {
            console.error("Error fetching permissions", err);
        } finally {
            setLoading(false);
        }
    };

    const closeMenusModal = () => {
        setMenusModalOpen(false);
        setSelectedRoleForMenus(null);
        setRoleMenus([]);
    };

    const openUsersModal = async (role) => {
        setSelectedRoleForUsers(role);
        setUsersModalOpen(true);
        setLoadingRoleUsers(true);
        try {
            // No tenemos un endpoint especifico getRoleUsers(id), así que:
            // Opción 1: Traer todos los users y filtrar. (Seguro y fácil para MVP)
            const allUsers = await getUsers();
            const filtered = allUsers.filter(u => u.role_id === role.id);
            setRoleUsers(filtered);
        } catch(err) {
            console.error("Error fetching role users", err);
            setRoleUsers([]);
        } finally {
            setLoadingRoleUsers(false);
        }
    };

    const closeUsersModal = () => {
        setUsersModalOpen(false);
        setSelectedRoleForUsers(null);
        setRoleUsers([]);
    };

    // 10. HANDLERS
    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setForm(prev => ({
            ...prev,
            name,
            slug: editingRole ? prev.slug : slug
        }));
    };

    const validateForm = () => {
        if (!form.name.trim()) return 'El nombre es requerido';
        if (!form.slug.trim()) return 'El identificador es requerido';
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
                slug: form.slug,
                description: form.description,
                is_active: form.is_active,
                menu_ids: form.menu_ids,
                session_timeout_minutes: form.session_timeout_minutes === '' ? null : parseInt(form.session_timeout_minutes)
            };

            let result;
            if (editingRole) {
                result = await updateRole(editingRole.id, payload);
            } else {
                result = await createRole(payload);
            }

            if (result.success) {
                setFormSuccess(editingRole ? 'Rol actualizado' : 'Rol creado');
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

    const handleDelete = async (role) => {
        if (!window.confirm(`¿Eliminar rol "${role.name}"?`)) return;

        try {
            const result = await deleteRole(role.id);
            if (result.success) {
                setFormSuccess('Rol eliminado');
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
        roles,
        filteredRoles,
        menus,
        loading,
        error,

        // Filters
        searchText,
        setSearchText,

        // UI State (CRUD)
        modalOpen,
        closeModal,
        saving,
        formError,
        setFormError,
        formSuccess,
        setFormSuccess,
        editingRole,

        // UI State (Consultations)
        menusModalOpen,
        closeMenusModal,
        selectedRoleForMenus,
        roleMenus,
        openMenusModal,

        usersModalOpen,
        closeUsersModal,
        selectedRoleForUsers,
        roleUsers,
        loadingRoleUsers,
        openUsersModal,

        // Forms
        form,
        setForm,
        handleChange,
        handleNameChange,

        // Actions
        openCreate,
        openEdit,
        handleSave,
        handleDelete,
        refetch: fetchData
    };
}
