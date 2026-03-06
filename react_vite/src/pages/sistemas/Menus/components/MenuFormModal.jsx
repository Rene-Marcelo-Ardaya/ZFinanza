import React, { useMemo } from 'react';
import { Save, Link as LinkIcon, Hash, Layout, Layers, Check, X } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSTooltip
} from '../../../../ds-components';
import { IconPicker } from './IconPicker';
import './MenuFormModal.css';

// ============================================================================
// SUBCOMPONENTES - Componentes reutilizables internos
// ============================================================================

/**
 * Componente de campo de formulario con etiqueta, validación y ayuda
 */
function FormField({
    label,
    children,
    required = false,
    help,
    error,
    className = ''
}) {
    return (
        <div className={`menu-form-field ${className}`}>
            <label className="menu-form-field__label">
                <span className="menu-form-field__label-content">
                    {label}
                    {help && <DSTooltip text={help} />}
                </span>
                {required && <span className="menu-form-field__required">*</span>}
            </label>
            <div className="menu-form-field__control-wrapper">
                {children}
                {error && (
                    <span className="menu-form-field__error">
                        <X size={12} />
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
}

/**
 * Componente de input con icono integrado
 */
function InputWithIcon({ icon: Icon, ...props }) {
    return (
        <div className="menu-form-input-group">
            {Icon && (
                <span className="menu-form-input-group__icon">
                    <Icon size={14} />
                </span>
            )}
            <input
                className={`menu-form-input-group__input ${Icon ? 'has-icon' : ''}`}
                {...props}
            />
        </div>
    );
}

/**
 * Componente de tarjeta de selección para tipo de menú
 */
function MenuTypeCard({
    type,
    icon: Icon,
    title,
    description,
    isSelected,
    onChange
}) {
    return (
        <label className={`menu-type-card ${isSelected ? 'is-selected' : ''}`}>
            <input
                type="radio"
                name="menu_type"
                value={type}
                checked={isSelected}
                onChange={onChange}
                className="menu-type-card__radio"
            />
            <div className="menu-type-card__content">
                <div className="menu-type-card__icon-wrapper">
                    <Icon size={20} />
                </div>
                <div className="menu-type-card__info">
                    <div className="menu-type-card__title">{title}</div>
                    <div className="menu-type-card__description">{description}</div>
                </div>
                {isSelected && (
                    <div className="menu-type-card__check">
                        <Check size={16} />
                    </div>
                )}
            </div>
        </label>
    );
}

/**
 * Componente de switch toggle para estado activo
 */
function ToggleSwitch({ checked, onChange, label }) {
    return (
        <label className="menu-form-toggle">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="menu-form-toggle__input"
            />
            <div className="menu-form-toggle__slider">
                <div className="menu-form-toggle__thumb" />
            </div>
            <span className="menu-form-toggle__label">{label}</span>
        </label>
    );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function MenuFormModal({
    isOpen,
    onClose,
    isEditing,
    form,
    parentMenus,
    icons,
    onChange,
    onSave,
    saving,
    error,
    setForm
}) {
    // ============================================================================
    // VALIDACIONES
    // ============================================================================

    const validation = useMemo(() => {
        const errors = {};

        if (!form.name?.trim()) {
            errors.name = 'El nombre es obligatorio';
        }

        if (form.menu_type === 'tab' && !form.parent_id) {
            errors.parent_id = 'Los tabs deben tener un menú padre';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0 && form.name?.trim()
        };
    }, [form]);

    // ============================================================================
    // FILTRADO DE MENÚS PADRE
    // ============================================================================

    const filteredParentMenus = useMemo(() => {
        if (!Array.isArray(parentMenus)) return [];

        return parentMenus.filter(parent => {
            // No permitir seleccionarse a sí mismo como padre
            if (isEditing && parent.id === form.id) return false;

            // Para tabs, solo mostrar menús sidebar
            if (form.menu_type === 'tab' && parent.menu_type === 'tab') return false;

            return true;
        });
    }, [parentMenus, form.menu_type, form.id, isEditing]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleMenuTypeChange = (e) => {
        const newType = e.target.value;
        setForm(prev => ({
            ...prev,
            menu_type: newType,
            // Limpiar parent_id si cambia a sidebar y no es necesario
            parent_id: newType === 'sidebar' ? '' : prev.parent_id
        }));
    };

    const handleSave = () => {
        if (validation.isValid) {
            onSave();
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="menu-form-modal__header">
                    <span className="menu-form-modal__title">
                        {isEditing ? 'Editar Menú' : 'Nuevo Menú'}
                    </span>
                    <span className="menu-form-modal__subtitle">
                        {isEditing ? 'Modifica la información del menú' : 'Crea un nuevo menú en el sistema'}
                    </span>
                </div>
            }
            size="xl"
            footer={
                <div className="menu-form-modal__footer">
                    <DSButton
                        variant="ghost"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancelar
                    </DSButton>
                    <DSButton
                        variant={validation.isValid ? 'success' : 'primary'}
                        onClick={handleSave}
                        disabled={!validation.isValid || saving}
                        loading={saving}
                        icon={!saving && <Save size={16} />}
                    >
                        {saving ? 'Guardando...' : 'Guardar Menú'}
                    </DSButton>
                </div>
            }
        >
            {/* Alerta de error */}
            {error && (
                <DSAlert
                    variant="error"
                    dismissible
                    onDismiss={() => { }}
                    className="menu-form-modal__alert"
                >
                    {error}
                </DSAlert>
            )}

            <div className="menu-form-modal__content">
                {/* Columna Izquierda: Información Básica */}
                <div className="menu-form-modal__column">
                    <DSModalSection
                        title="Información Básica"
                        icon={<Layout size={18} />}
                    >
                        <form className="menu-form-modal__form" onSubmit={e => e.preventDefault()}>
                            <FormField
                                label="Nombre del Menú"
                                required
                                help="Nombre visible en la navegación del sistema"
                                error={validation.errors.name}
                            >
                                <InputWithIcon
                                    type="text"
                                    value={form.name}
                                    onChange={onChange('name')}
                                    placeholder="Ej: Dashboard, Usuarios, Reportes"
                                    autoFocus
                                />
                            </FormField>

                            <FormField
                                label="URL / Ruta"
                                help="Ruta de React Router (ej: /dashboard)"
                            >
                                <InputWithIcon
                                    icon={LinkIcon}
                                    type="text"
                                    value={form.url}
                                    onChange={onChange('url')}
                                    placeholder="/ejemplo/ruta"
                                />
                            </FormField>

                            <FormField
                                label="Módulo"
                                help="Agrupador lógico para organizar menús (opcional)"
                            >
                                <InputWithIcon
                                    type="text"
                                    value={form.module}
                                    onChange={onChange('module')}
                                    placeholder="Ej: SISTEMAS, RRHH, FINANZAS"
                                />
                            </FormField>

                            <FormField
                                label="Orden de Visualización"
                                help="Posición en la lista de menús (menor = más arriba)"
                            >
                                <InputWithIcon
                                    icon={Hash}
                                    type="number"
                                    value={form.order}
                                    onChange={onChange('order')}
                                    min="0"
                                    placeholder="0"
                                />
                            </FormField>
                        </form>
                    </DSModalSection>
                </div>

                {/* Columna Derecha: Configuración */}
                <div className="menu-form-modal__column">
                    <DSModalSection
                        title="Configuración Visual"
                        icon={<Layers size={18} />}
                    >
                        <form className="menu-form-modal__form" onSubmit={e => e.preventDefault()}>
                            {/* Selector de Tipo de Menú */}
                            <FormField
                                label="Tipo de Menú"
                                required
                                help="Define cómo se mostrará este menú en la interfaz"
                            >
                                <div className="menu-type-selector">
                                    <MenuTypeCard
                                        type="sidebar"
                                        icon={Layout}
                                        title="Sidebar"
                                        description="Menú principal en la barra lateral"
                                        isSelected={form.menu_type === 'sidebar' || !form.menu_type}
                                        onChange={handleMenuTypeChange}
                                    />
                                    <MenuTypeCard
                                        type="tab"
                                        icon={Layers}
                                        title="Tab"
                                        description="Pestaña dentro de una página"
                                        isSelected={form.menu_type === 'tab'}
                                        onChange={handleMenuTypeChange}
                                    />
                                </div>
                                {form.menu_type === 'tab' && (
                                    <div className="menu-type-hint">
                                        <div className="menu-type-hint__icon">
                                            <Layout size={14} />
                                        </div>
                                        <div className="menu-type-hint__content">
                                            <strong>Nota:</strong> Los tabs deben tener un "Menú Padre" seleccionado
                                            para funcionar correctamente dentro de la página.
                                        </div>
                                    </div>
                                )}
                            </FormField>

                            {/* Selector de Icono */}
                            <FormField
                                label="Icono"
                                help="Icono visual que representa el menú"
                            >
                                <IconPicker
                                    icons={icons}
                                    value={form.icon}
                                    onChange={(val) => setForm(prev => ({ ...prev, icon: val }))}
                                />
                            </FormField>

                            {/* Selector de Menú Padre */}
                            <FormField
                                label="Menú Padre"
                                help="Selecciona si este menú es un submenú o tab"
                                error={validation.errors.parent_id}
                            >
                                <select
                                    className={`menu-form-select ${validation.errors.parent_id ? 'has-error' : ''}`}
                                    value={form.parent_id}
                                    onChange={onChange('parent_id')}
                                >
                                    <option value="">(Raíz / Principal)</option>
                                    {filteredParentMenus.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {/* Toggle de Estado */}
                            <FormField
                                label="Estado"
                                help="Los menús inactivos no se muestran en la navegación"
                            >
                                <ToggleSwitch
                                    checked={form.is_active}
                                    onChange={onChange('is_active')}
                                    label="Menú Activo"
                                />
                            </FormField>
                        </form>
                    </DSModalSection>
                </div>
            </div>
        </DSModal>
    );
}
