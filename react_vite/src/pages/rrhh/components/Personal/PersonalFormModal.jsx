import React from 'react';
import { Briefcase, Lock, Save } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSAlert,
    DSModalSection,
    DSModalGrid,
    DSSearchSelect,
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

export function PersonalFormModal({
    isOpen,
    onClose,
    isEditing,
    form,
    onChange,
    onSave,
    saving,
    error,
    cargos,
    setForm,
    pinError,
    setPinError
}) {
    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
            size="xl"
            footer={
                <>
                    <DSButton onClick={onClose} disabled={saving}>
                        Cancelar
                    </DSButton>
                    {/* Validacion inline para el boton verde */}
                    {(() => {
                        const isFormValid = form.ci && form.nombre && form.apellido_paterno && form.cargo_id && form.fecha_ingreso;
                        return (
                            <DSButton
                                variant={isFormValid ? 'success' : 'primary'}
                                onClick={onSave}
                                disabled={saving}
                                loading={saving}
                                icon={!saving && <Save size={16} />}
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </DSButton>
                        );
                    })()}
                </>
            }
        >
            {error && (
                <DSAlert variant="error" dismissible onDismiss={() => { }} className="personal-alert-margin">
                    {error}
                </DSAlert>
            )}

            <DSModalGrid>
                {/* Columna izquierda: Datos personales */}
                <div>
                    <DSModalSection title="Datos Personales">
                        <form className="personal-form" onSubmit={e => e.preventDefault()}>
                            <div className="personal-form__row">
                                <FormField label="CI" required help="Carnet de identidad del empleado">
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.ci}
                                        onChange={onChange('ci')}
                                        placeholder="12345678"
                                    />
                                </FormField>
                            </div>

                            <FormField label="Nombre" required help="Nombre(s) del empleado">
                                <input
                                    type="text"
                                    className="ds-field__control"
                                    value={form.nombre}
                                    onChange={(e) => {
                                        const upperValue = e.target.value.toUpperCase();
                                        setForm(prev => ({ ...prev, nombre: upperValue }));
                                    }}
                                    placeholder="JUAN"
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </FormField>

                            <div className="personal-form__row">
                                <FormField label="Apellido Paterno" required>
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.apellido_paterno}
                                        onChange={(e) => {
                                            const upperValue = e.target.value.toUpperCase();
                                            setForm(prev => ({ ...prev, apellido_paterno: upperValue }));
                                        }}
                                        placeholder="PÉREZ"
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </FormField>
                                <FormField label="Apellido Materno">
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.apellido_materno}
                                        onChange={(e) => {
                                            const upperValue = e.target.value.toUpperCase();
                                            setForm(prev => ({ ...prev, apellido_materno: upperValue }));
                                        }}
                                        placeholder="GARCÍA"
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </FormField>
                            </div>

                            <div className="personal-form__row">
                                <FormField label="Fecha Nacimiento">
                                    <input
                                        type="date"
                                        className="ds-field__control"
                                        value={form.fecha_nacimiento}
                                        onChange={onChange('fecha_nacimiento')}
                                    />
                                </FormField>
                                <FormField label="Género">
                                    <select
                                        className="ds-field__control"
                                        value={form.genero}
                                        onChange={onChange('genero')}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="O">Otro</option>
                                    </select>
                                </FormField>
                            </div>

                            <FormField label="Dirección">
                                <input
                                    type="text"
                                    className="ds-field__control"
                                    value={form.direccion}
                                    onChange={onChange('direccion')}
                                    placeholder="Av. Principal #123"
                                />
                            </FormField>

                            <div className="personal-form__row">
                                <FormField label="Teléfono">
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.telefono}
                                        onChange={onChange('telefono')}
                                        placeholder="70012345"
                                    />
                                </FormField>
                                <FormField label="Email">
                                    <input
                                        type="email"
                                        className="ds-field__control"
                                        value={form.email}
                                        onChange={onChange('email')}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </FormField>
                            </div>
                        </form>
                    </DSModalSection>
                </div>

                {/* Columna derecha: Datos laborales */}
                <div>
                    <DSModalSection title="Datos Laborales" icon={<Briefcase size={16} />}>
                        <form className="personal-form" onSubmit={e => e.preventDefault()}>
                            <FormField label="Cargo" required help="Cargo o puesto de trabajo asignado">
                                <DSSearchSelect
                                    options={cargos.map(cargo => ({ value: cargo.id, label: cargo.nombre }))}
                                    value={form.cargo_id}
                                    onChange={(val) => setForm(prev => ({ ...prev, cargo_id: val }))}
                                    placeholder="Seleccionar cargo..."
                                    searchPlaceholder="Buscar cargo..."
                                />
                            </FormField>

                            <div className="personal-form__row">
                                <FormField label="Fecha Ingreso" required help="Fecha en que ingresó a la empresa">
                                    <input
                                        type="date"
                                        className="ds-field__control"
                                        value={form.fecha_ingreso}
                                        onChange={onChange('fecha_ingreso')}
                                    />
                                </FormField>
                                <FormField label="Fecha Salida" help="Fecha de baja o término de contrato">
                                    <input
                                        type="date"
                                        className="ds-field__control"
                                        value={form.fecha_salida}
                                        onChange={onChange('fecha_salida')}
                                    />
                                </FormField>
                            </div>

                            <div className="personal-form__row">
                                <FormField label="Salario" help="Salario mensual en moneda local">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="ds-field__control"
                                        value={form.salario}
                                        onChange={onChange('salario')}
                                        placeholder="0.00"
                                    />
                                </FormField>
                                <FormField label="Tipo Contrato" help="Tipo de contrato laboral">
                                    <input
                                        type="text"
                                        className="ds-field__control"
                                        value={form.tipo_contrato}
                                        onChange={onChange('tipo_contrato')}
                                        placeholder="Ej: Indefinido, Temporal..."
                                    />
                                </FormField>
                            </div>
                        </form>
                    </DSModalSection>

                    <DSModalSection title="Seguridad" icon={<Lock size={16} />}>
                        <form className="personal-form" onSubmit={e => e.preventDefault()}>
                            <div className="personal-form__row">
                                <FormField
                                    label="PIN"
                                    required={!isEditing}
                                    help="Código de 4 dígitos para acceso"
                                >
                                    <input
                                        type="password"
                                        maxLength={4}
                                        className="ds-field__control"
                                        value={form.pin}
                                        onChange={onChange('pin')}
                                        placeholder={isEditing ? "Dejar vacío para no cambiar" : "****"}
                                    />
                                </FormField>
                                <FormField
                                    label="Confirmar PIN"
                                    required={!isEditing || form.pin}
                                >
                                    <input
                                        type="password"
                                        maxLength={4}
                                        className={`ds-field__control ${pinError ? 'ds-field__control--error' : ''}`}
                                        value={form.pin_confirmation}
                                        onChange={onChange('pin_confirmation')}
                                        onBlur={() => {
                                            if (form.pin && form.pin_confirmation && form.pin !== form.pin_confirmation) {
                                                setPinError('Los PINs no coinciden');
                                            } else {
                                                setPinError(null);
                                            }
                                        }}
                                        placeholder="****"
                                    />
                                    {pinError && <span className="ds-field__error">{pinError}</span>}
                                </FormField>
                            </div>

                            <FormField label="Observaciones">
                                <textarea
                                    className="ds-field__control personal-textarea"
                                    value={form.observaciones}
                                    onChange={onChange('observaciones')}
                                    placeholder="Notas adicionales..."
                                    rows={3}
                                />
                            </FormField>
                        </form>
                    </DSModalSection>
                </div>
            </DSModalGrid>
        </DSModal>
    );
}
