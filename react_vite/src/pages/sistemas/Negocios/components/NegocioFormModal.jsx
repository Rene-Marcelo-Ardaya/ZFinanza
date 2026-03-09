import React from 'react';
import { Save } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSTooltip,
    DSCheckbox
} from '../../../../ds-components';

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

export function NegocioFormModal({
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
            title={isEditing ? 'Editar Negocio' : 'Nuevo Negocio'}
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
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="negocios-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalSection title="Información del Negocio">
                <form className="negocios-form" onSubmit={e => e.preventDefault()}>
                    <FormField
                        label="Nombre del Negocio"
                        required
                        help="Nombre del negocio o empresa. Ej: Mi Empresa S.A."
                    >
                        <input
                            type="text"
                            className="ds-field__control"
                            value={form.nombre}
                            onChange={onChange('nombre')}
                            placeholder="Ej: Mi Empresa S.A."
                        />
                    </FormField>

                    <FormField
                        label="Estado"
                        help="Indica si el negocio está activo en el sistema."
                    >
                        <DSCheckbox
                            checked={form.is_active}
                            onChange={onChange('is_active')}
                            label="Activo"
                        />
                    </FormField>
                </form>
            </DSModalSection>
        </DSModal>
    );
}

export default NegocioFormModal;
