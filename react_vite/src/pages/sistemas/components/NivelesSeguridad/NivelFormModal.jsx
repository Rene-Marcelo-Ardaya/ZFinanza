import React from 'react';
import { Save, Shield } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSTooltip
} from '../../../../ds-components';
import { ColorPicker } from './ColorPicker';

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

export function NivelFormModal({
    isOpen,
    onClose,
    isEditing,
    form,
    setForm,
    onChange,
    onSave,
    saving,
    error
}) {
    // Validacion para boton verde
    const isFormValid = form.nombre && form.nombre.trim() !== '';

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Grupo' : 'Nuevo Grupo de Seguridad'}
            icon={<Shield size={20} />}
            size="md"
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
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="niveles-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalSection title="Información del Grupo">
                <form className="niveles-form" onSubmit={e => e.preventDefault()}>
                    <FormField
                        label="Nombre del Grupo"
                        required
                        help="Nombre identificativo del grupo. Ej: Administración, Operaciones."
                    >
                        <input
                            type="text"
                            className="ds-field__control"
                            value={form.nombre}
                            onChange={onChange('nombre')}
                            placeholder="Ej: Administración"
                        />
                    </FormField>

                    <FormField
                        label="Color"
                        help="Color para identificar visualmente el grupo."
                    >
                        <ColorPicker
                            value={form.color}
                            onChange={(color) => setForm(prev => ({ ...prev, color }))}
                        />
                    </FormField>

                    <FormField
                        label="Descripción"
                        help="Breve explicación del propósito del grupo."
                    >
                        <textarea
                            className="ds-field__control niveles-textarea"
                            value={form.descripcion}
                            onChange={onChange('descripcion')}
                            placeholder="Descripción del grupo..."
                            rows={3}
                        />
                    </FormField>

                    <FormField
                        label="Estado"
                        help="Los grupos inactivos no se pueden asignar a componentes."
                    >
                        <label className="niveles-checkbox">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={onChange('is_active')}
                            />
                            <span>Grupo Activo</span>
                        </label>
                    </FormField>
                </form>
            </DSModalSection>
        </DSModal>
    );
}
