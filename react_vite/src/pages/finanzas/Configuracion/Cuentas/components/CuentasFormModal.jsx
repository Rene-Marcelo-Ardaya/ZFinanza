import React from 'react';
import { Wallet, Save } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSCheckbox
} from '../../../../../ds-components';
import './CuentasFormModal.css';

function FormField({ label, children, required, help }) {
    return (
        <div className="ds-field">
            <label className="ds-field__label">
                <span className="ds-field__label-text">{label}</span>
                {required && <span className="ds-field__required">*</span>}
            </label>
            <div className="ds-field__control-wrapper">
                {children}
            </div>
        </div>
    );
}

export function CuentasFormModal({
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
            title={isEditing ? 'Editar Cuenta' : 'Nueva Cuenta'}
            size="md"
            footer={
                <>
                    <DSButton onClick={onClose} disabled={saving}>
                        Cancelar
                    </DSButton>
                    <DSButton
                        variant={form.nombre.trim() ? 'success' : 'primary'}
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
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="cuentas-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalSection title="Información de la Cuenta" icon={<Wallet size={16} />}>
                <form className="cuentas-form" onSubmit={e => e.preventDefault()}>
                    <FormField label="Nombre" required>
                        <input
                            type="text"
                            className="ds-field__control"
                            value={form.nombre}
                            onChange={onChange('nombre')}
                            placeholder="Ej: Caja Chica, Banco, etc."
                            maxLength={255}
                        />
                    </FormField>

                    <FormField label="Descripción">
                        <textarea
                            className="ds-field__control cuentas-textarea"
                            value={form.descripcion}
                            onChange={onChange('descripcion')}
                            placeholder="Descripción opcional de la cuenta..."
                            rows={4}
                            maxLength={1000}
                        />
                    </FormField>

                    <div className="cuentas-form__toggle">
                        <DSCheckbox
                            checked={form.is_active}
                            onChange={onChange('is_active')}
                            label="Cuenta activa"
                            help="Las cuentas activas están disponibles para su uso en el sistema"
                        />
                    </div>
                </form>
            </DSModalSection>
        </DSModal>
    );
}

export default CuentasFormModal;
