import React from 'react';
import { Save } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSTooltip
} from '../../../../ds-components';

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

export function UserFormModal({
    isOpen,
    onClose,
    isEditing,
    form,
    roles,
    personal,
    onChange,
    onSave,
    saving,
    error
}) {
    // Validacion para boton verde
    const isFormValid = form.name && form.name.trim() !== '' && form.role_id && form.id_personal;

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="usuarios-alert-margin">
                    {error}
                </DSAlert>
            )}

            <form className="usuarios-form" onSubmit={e => e.preventDefault()}>
                <FormField
                    label="Nombre de Usuario"
                    required
                    help="Nombre y apellido del usuario. Será visible en el sistema."
                >
                    <input
                        type="text"
                        className="ds-field__control"
                        value={form.name}
                        onChange={(e) => {
                            const upperValue = e.target.value.toUpperCase();
                            onChange('name')({ target: { value: upperValue } });
                        }}
                        placeholder="EJ: JUAN PÉREZ"
                        style={{ textTransform: 'uppercase' }}
                    />
                </FormField>

                <FormField
                    label="Correo Electrónico"
                    help="Email para notificaciones (opcional)."
                >
                    <input
                        type="email"
                        className="ds-field__control"
                        value={form.email}
                        onChange={onChange('email')}
                        placeholder="correo@ejemplo.com"
                    />
                </FormField>

                <FormField
                    label={isEditing ? 'Contraseña (opcional)' : 'Contraseña'}
                    required={!isEditing}
                    help="Mínimo 6 caracteres. Al editar, dejar vacío para mantener la contraseña actual."
                >
                    <input
                        type="password"
                        className="ds-field__control"
                        value={form.password}
                        onChange={onChange('password')}
                        placeholder={isEditing ? 'Dejar vacío para mantener' : '••••••••'}
                    />
                </FormField>

                <FormField
                    label="Rol Asignado"
                    required
                    help="Define los permisos y menús que el usuario podrá ver."
                >
                    <select
                        className="ds-field__control"
                        value={form.role_id}
                        onChange={onChange('role_id')}
                    >
                        <option value="">-- Seleccionar --</option>
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Personal Asociado"
                    required
                    help="Vincula este usuario a un empleado del sistema RRHH."
                >
                    <select
                        className="ds-field__control"
                        value={form.id_personal}
                        onChange={onChange('id_personal')}
                    >
                        <option value="">-- Seleccionar --</option>
                        {personal.map(p => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </FormField>

                {isEditing && (
                    <FormField
                        label="Estado"
                        help="Los usuarios inactivos no pueden iniciar sesión en el sistema."
                    >
                        <label className="usuarios-checkbox">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={onChange('is_active')}
                            />
                            <span>Usuario Activo</span>
                        </label>
                    </FormField>
                )}
            </form>
        </DSModal>
    );
}
