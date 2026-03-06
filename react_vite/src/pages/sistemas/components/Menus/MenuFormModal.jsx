import React from 'react';
import { Save, Link as LinkIcon, Hash } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSModalGrid,
    DSTooltip
} from '../../../../ds-components';
import { IconPicker } from './IconPicker';

// DSTooltip importado de ds-components

function FormField({ label, children, required, help }) {
    return (
        <div className="ds-field">
            <label className="ds-field__label">
                <span className="ds-field__label-text">
                    {label}
                    {help && <DSTooltip text={help} />}
                </span>
                {required && <span className="ds-field__required">*</span>}
            </label>
            <div className="ds-field__control-wrapper">
                {children}
            </div>
        </div>
    );
}

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
    // Filtrar para no permitir autoseleccionarse como padre si se edita
    const filteredParents = Array.isArray(parentMenus) ? parentMenus : []; // Asegurar que sea un array

    // Validacion para boton verde
    const isFormValid = form.name && form.name.trim() !== '';

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Menú' : 'Nuevo Menú'}
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
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="menus-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalGrid>
                {/* Columna izquierda: Datos principales */}
                <div>
                    <DSModalSection title="Información Básica">
                        <form className="menus-form" onSubmit={e => e.preventDefault()}>
                            <FormField label="Nombre" required help="Nombre visible en la navegación">
                                <input
                                    type="text"
                                    className="ds-field__control"
                                    value={form.name}
                                    onChange={onChange('name')}
                                    placeholder="Ej: Dashboard"
                                    autoFocus
                                />
                            </FormField>

                            <FormField label="URL / Ruta" help="Ruta de React Router (ej: /dashboard)">
                                <div className="ds-field__input-group">
                                    <span className="ds-field__input-icon"><LinkIcon size={14} /></span>
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.url}
                                        onChange={onChange('url')}
                                        placeholder="/ejemplo/ruta"
                                    />
                                </div>
                            </FormField>

                            <div className="menus-form__row">
                                <FormField label="Módulo" help="Agrupador lógico (opcional)">
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.module}
                                        onChange={onChange('module')}
                                        placeholder="Ej: SISTEMAS"
                                    />
                                </FormField>
                                <FormField label="Orden" help="Posición en la lista">
                                    <div className="ds-field__input-group">
                                        <span className="ds-field__input-icon"><Hash size={14} /></span>
                                        <input
                                            type="number"
                                            className="ds-field__control"
                                            value={form.order}
                                            onChange={onChange('order')}
                                        />
                                    </div>
                                </FormField>
                            </div>
                        </form>
                    </DSModalSection>
                </div>

                {/* Columna derecha: Configuración */}
                <div>
                    <DSModalSection title="Configuración Visual">
                        <form className="menus-form" onSubmit={e => e.preventDefault()}>
                            <FormField label="Icono" help="Icono visual del menú">
                                <IconPicker
                                    icons={icons}
                                    value={form.icon}
                                    onChange={(val) => setForm(prev => ({ ...prev, icon: val }))}
                                />
                            </FormField>

                            <FormField label="Menú Padre" help="Selecciona si es un submenú">
                                <select
                                    className="ds-field__control"
                                    value={form.parent_id}
                                    onChange={onChange('parent_id')}
                                >
                                    <option value="">(Raíz / Principal)</option>
                                    {filteredParents.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField label="Estado">
                                <label className="menus-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={onChange('is_active')}
                                    />
                                    <span>Menú Activo</span>
                                </label>
                            </FormField>
                        </form>
                    </DSModalSection>
                </div>
            </DSModalGrid>
        </DSModal>
    );
}
