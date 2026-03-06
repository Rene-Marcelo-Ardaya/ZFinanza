import { useState, useEffect, useCallback } from 'react';
import {
    getMenus,
    getParentMenus,
    getAvailableIcons,
    getMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    updateMenuPositions
} from '../../../../services/menuAdminService';
import { arrayMove } from '@dnd-kit/sortable';

export function useMenus() {
    // 1. DATA STATE
    const [menus, setMenus] = useState([]);
    const [parentMenus, setParentMenus] = useState([]);
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. MODAL & FORM STATE
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [editingMenu, setEditingMenu] = useState(null);
    const [expandedIds, setExpandedIds] = useState([]);

    // 3. ORDER MODE STATE
    const [isOrderMode, setIsOrderMode] = useState(false);
    const [orderedItems, setOrderedItems] = useState([]);
    const [savingOrder, setSavingOrder] = useState(false);

    // 4. INITIAL FORM STATE
    const emptyForm = {
        name: '',
        url: '',
        icon: '',
        parent_id: '',
        order: 0,
        module: '',
        is_active: true
    };

    const [form, setForm] = useState(emptyForm);

    // 5. FETCHING
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [menusRes, parentsRes, iconsRes] = await Promise.all([
                getMenus(),
                getParentMenus(),
                getAvailableIcons()
            ]);
            setMenus(menusRes || []);
            setParentMenus(parentsRes || []);
            setIcons(iconsRes || []);
        } catch (err) {
            if (err.message?.includes('403') || err.message?.includes('Acceso denegado')) {
                setError('Acceso denegado. Esta sección es solo para superusuarios.');
            } else {
                setError('Error cargando datos');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Expandir todos por defecto al cargar
    useEffect(() => {
        if (menus.length > 0 && expandedIds.length === 0) {
            setExpandedIds(menus.map(m => m.id));
        }
    }, [menus]); // Removed expandedIds from dependency api to avoid re-expanding if user collapsed

    // 6. ACTIONS
    const resetForm = useCallback(() => {
        setForm(emptyForm);
        setEditingMenu(null);
        setFormError(null);
    }, []);

    const openCreate = (parentId = null) => {
        resetForm();
        if (parentId) {
            // Find parent if passed (optional improvement if calling from child row)
            // For now simple default
        }
        setModalOpen(true);
    };

    const openEdit = async (menu) => {
        const menuDetail = await getMenu(menu.id);
        if (menuDetail) {
            setEditingMenu(menu);
            setForm({
                name: menuDetail.name,
                url: menuDetail.url || '',
                icon: menuDetail.icon || '',
                parent_id: menuDetail.parent_id || '',
                order: menuDetail.order || 0,
                module: menuDetail.module || '',
                is_active: menuDetail.is_active == 1 || menuDetail.is_active === true
            });
            setFormError(null);
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    // 7. HANDLERS
    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.type === 'number'
                ? parseInt(e.target.value) || 0
                : e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!form.name.trim()) return 'El nombre es requerido';
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
                url: form.url || null,
                icon: form.icon || null,
                parent_id: form.parent_id || null,
                order: form.order,
                module: form.module || null,
                is_active: form.is_active
            };

            let result;
            if (editingMenu) {
                result = await updateMenu(editingMenu.id, payload);
            } else {
                result = await createMenu(payload);
            }

            if (result.success) {
                setFormSuccess(editingMenu ? 'Menú actualizado' : 'Menú creado');
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

    const handleDelete = async (menu) => {
        if (!window.confirm(`¿Eliminar menú "${menu.name}"?`)) return;

        try {
            const result = await deleteMenu(menu.id);
            if (result.success) {
                setFormSuccess('Menú eliminado');
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                alert(result.error || 'Error eliminando');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    // 8. DRAG & DROP LOGIC
    const enterOrderMode = () => {
        const hierarchical = menus.map(m => ({
            ...m,
            children: (m.children || []).map(c => ({ ...c }))
        }));
        setOrderedItems(hierarchical);
        setIsOrderMode(true);
    };

    const cancelOrderMode = () => {
        setIsOrderMode(false);
        setOrderedItems([]);
    };

    const handleReorderChildren = (parentId, reorderedChildren) => {
        setOrderedItems(prev => prev.map(p =>
            p.id === parentId
                ? { ...p, children: reorderedChildren }
                : p
        ));
    };

    const handleParentDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setOrderedItems(prev => {
                const oldIndex = prev.findIndex(p => `parent-${p.id}` === active.id);
                const newIndex = prev.findIndex(p => `parent-${p.id}` === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    const newArr = arrayMove(prev, oldIndex, newIndex);
                    return newArr.map((item, idx) => ({ ...item, order: idx + 1 }));
                }
                return prev;
            });
        }
    };

    const saveOrder = async () => {
        setSavingOrder(true);
        try {
            const items = [];
            orderedItems.forEach((parent, parentIdx) => {
                items.push({
                    id: parent.id,
                    parent_id: null,
                    order: parentIdx + 1
                });
                if (parent.children) {
                    parent.children.forEach((child, childIdx) => {
                        items.push({
                            id: child.id,
                            parent_id: parent.id,
                            order: childIdx + 1
                        });
                    });
                }
            });

            const result = await updateMenuPositions(items);
            if (result.success) {
                setFormSuccess('Orden guardado correctamente');
                setIsOrderMode(false);
                setOrderedItems([]);
                fetchData();
                setTimeout(() => setFormSuccess(null), 3000);
            } else {
                setFormError(result.error || 'Error guardando orden');
            }
        } catch (err) {
            setFormError('Error de conexión');
        } finally {
            setSavingOrder(false);
        }
    };

    return {
        // Data
        menus,
        parentMenus,
        icons,
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
        editingMenu,
        expandedIds,
        toggleExpand,

        // Order Mode
        isOrderMode,
        orderedItems,
        savingOrder,

        // Forms
        form,
        setForm,
        handleChange,

        // Actions
        openCreate,
        openEdit,
        handleSave,
        handleDelete,
        refetch: fetchData,

        // Drag & Drop
        enterOrderMode,
        cancelOrderMode,
        handleReorderChildren,
        handleParentDragEnd,
        saveOrder
    };
}
