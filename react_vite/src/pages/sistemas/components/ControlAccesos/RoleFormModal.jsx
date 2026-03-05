import React from 'react';
import { Save, Menu as MenuIcon } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSModalGrid,
    DSTooltip
} from '../../../../ds-components';
import { MenuTree } from './MenuTree';

// DSTooltip importado de ds-components

function FormField({ label, children, required, help }) {
    const labelContent = (
        <>
            {label}
            {help && <DSTooltip text={help} />}
        </>
    );

    return (
        <div className="ds-field">
            <label className="ds-field__label">
                <span className="ds-field__label-text">{labelContent}</span>
                {required && <span className="ds-field__required">*</span>}
            </label>
            <div className="ds-field__control-wrapper">
                {children}
            </div>
        </div>
    );
}

export function RoleFormModal({
    isOpen,
    onClose,
    isEditing,
    form,
    menus,
    onChange,
    onNameChange,
    onSave,
    saving,
    error,
    setForm
}) {
    // Filtrar menús activos (incluye children). El backend no siempre envía
    // `is_active`, así que consideramos activos los menús que no tengan ese
    // campo, o que tengan true/1. También limpiamos `form.menu_ids` que
    // referencien menús eliminados por el filtro.
    const activeMenus = React.useMemo(() => {
        if (!Array.isArray(menus)) return [];
        const isActive = (item) => (item.is_active == null) || item.is_active === true || item.is_active == 1;
        return menus
            .filter(isActive)
            .map(m => ({
                ...m,
                children: Array.isArray(m.children) ? m.children.filter(isActive) : []
            }));
    }, [menus]);

    const activeIds = React.useMemo(() => {
        const ids = new Set();
        activeMenus.forEach(m => {
            if (m.id != null) ids.add(m.id);
            (m.children || []).forEach(c => { if (c.id != null) ids.add(c.id); });
        });
        return ids;
    }, [activeMenus]);

    React.useEffect(() => {
        if (!Array.isArray(form.menu_ids)) return;
        const cleaned = form.menu_ids.filter(id => activeIds.has(id));
        if (cleaned.length !== (form.menu_ids || []).length) {
            setForm(prev => ({ ...prev, menu_ids: cleaned }));
        }
    }, [activeIds, form.menu_ids, setForm]);
    // Validacion para boton verde
    const isFormValid = form.name && form.name.trim() !== '' && form.slug && form.slug.trim() !== '';

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Rol' : 'Nuevo Rol'}
            size="xl"
            footer={
                <>
                    <DSButton onClick={onClose} disabled={saving}>
                        Cancelar
                    </DSButton>
                    <DSButton
                        variant={isFormValid ? 'success' : 'primary'}
                        onClick={onSave}
                        disabled={saving}
                        loading={saving}
                        icon={!saving && <Save size={16} />}
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </DSButton>
                </>
            }
        >
            {error && (
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="accesos-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalGrid>
                {/* Columna izquierda: Datos del rol */}
                <div>
                    <DSModalSection title="Información del Rol">
                        <form className="accesos-form" onSubmit={e => e.preventDefault()}>
                            <FormField
                                label="Nombre del Rol"
                                required
                                help="Nombre descriptivo del rol. Ej: Administrador, Vendedor, Soporte."
                            >
                                <input
                                    type="text"
                                    className="ds-field__control"
                                    value={form.name}
                                    onChange={onNameChange}
                                    placeholder="Ej: Administrador"
                                />
                            </FormField>

                            <FormField
                                label="Identificador (slug)"
                                required
                                help="Código único para uso interno. Se genera automáticamente."
                            >
                                <input
                                    type="text"
                                    className="ds-field__control"
                                    value={form.slug}
                                    onChange={onChange('slug')}
                                    placeholder="admin"
                                    disabled={isEditing}
                                />
                            </FormField>

                            <FormField
                                label="Descripción"
                                help="Breve explicación del propósito del rol."
                            >
                                <textarea
                                    className="ds-field__control accesos-textarea"
                                    value={form.description}
                                    onChange={onChange('description')}
                                    placeholder="Descripción del rol..."
                                    rows={3}
                                />
                            </FormField>

                            <FormField
                                label="Estado"
                                help="Los roles inactivos no se pueden asignar."
                            >
                                <label className="accesos-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={onChange('is_active')}
                                    />
                                    <span>Rol Activo</span>
                                </label>
                            </FormField>

                            <FormField
                                label="Tiempo de Sesión (minutos)"
                                help="Tiempo máximo que un usuario puede estar logueado. Vacío = sin límite."
                            >
                                <input
                                    type="number"
                                    min="0"
                                    className="ds-field__control"
                                    value={form.session_timeout_minutes}
                                    onChange={onChange('session_timeout_minutes')}
                                    placeholder="Ej: 60 (1 hora), 480 (8 horas)"
                                />
                            </FormField>
                        </form>
                    </DSModalSection>
                </div>

                {/* Columna derecha: Menús */}
                <div>
                    <DSModalSection
                        title="Menús Asignados"
                        icon={<MenuIcon size={16} />}
                        help="Selecciona los menús que este rol podrá visualizar:"
                    >
                        <MenuTree
                            menus={activeMenus}
                            selectedIds={form.menu_ids}
                            onChange={(ids) => setForm(prev => ({ ...prev, menu_ids: ids }))}
                        />
                    </DSModalSection>
                </div>
            </DSModalGrid>
        </DSModal>
    );
}
