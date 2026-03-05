import React from 'react';
import { Save } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSTooltip
} from '../../../../ds-components';

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

export function CargoFormModal({
    isOpen,
    onClose,
    isEditing,
    form,
    onChange,
    onSave,
    saving,
    error
}) {
    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Cargo' : 'Nuevo Cargo'}
            size="md"
            footer={
                <>
                    <DSButton onClick={onClose} disabled={saving}>
                        Cancelar
                    </DSButton>
                    <DSButton
                        variant={form.nombre && form.nombre.trim() !== '' ? 'success' : 'primary'}
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
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="cargos-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalSection title="Información del Cargo">
                <form className="cargos-form" onSubmit={e => e.preventDefault()}>
                    <FormField
                        label="Nombre del Cargo"
                        required
                        help="Nombre descriptivo del cargo. Ej: Gerente, Analista, Asistente."
                    >
                        <input
                            type="text"
                            className="ds-field__control"
                            value={form.nombre}
                            onChange={onChange('nombre')}
                            placeholder="Ej: Gerente de Ventas"
                        />
                    </FormField>

                    <FormField
                        label="Descripción"
                        help="Descripción detallada de las funciones y responsabilidades del cargo."
                    >
                        <textarea
                            className="ds-field__control cargos-textarea"
                            value={form.descripcion}
                            onChange={onChange('descripcion')}
                            placeholder="Descripción del cargo..."
                            rows={4}
                        />
                    </FormField>

                    <FormField
                        label="Estado"
                        help="Los cargos inactivos no se pueden asignar a personal."
                    >
                        <label className="cargos-checkbox">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={onChange('is_active')}
                            />
                            <span>Cargo Activo</span>
                        </label>
                    </FormField>
                </form>
            </DSModalSection>
        </DSModal>
    );
}
