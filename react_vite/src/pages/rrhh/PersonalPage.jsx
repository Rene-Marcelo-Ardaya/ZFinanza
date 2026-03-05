import React from 'react';
import { UserCircle, Plus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    SecuredButton
} from '../../ds-components';

import './PersonalPage.css';

// Hook
import { usePersonal } from './hooks/usePersonal';

// Components
import { PersonalTable } from './components/Personal/PersonalTable';
import { PersonalFormModal } from './components/Personal/PersonalFormModal';

export function PersonalPage() {
    const logic = usePersonal();

    return (
        <DSPage>
            <DSPageHeader
                title="Gestión de Personal"
                icon={<UserCircle size={22} />}
                actions={
                    <SecuredButton
                        securityId="personal.crear"
                        securityDesc="Crear nuevo empleado"
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={logic.openCreate}
                    >
                        Nuevo Empleado
                    </SecuredButton>
                }
            />

            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="personal-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="personal-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            <PersonalTable
                personal={logic.personal}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onRefresh={logic.refetch}
                cargos={logic.cargos}
                cargoFilter={logic.cargoFilter}
                setCargoFilter={logic.setCargoFilter}
            />

            <PersonalFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingEmpleado}
                form={logic.form}
                setForm={logic.setForm}
                onChange={logic.handleChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
                cargos={logic.cargos}
                pinError={logic.pinError}
                setPinError={logic.setPinError}
            />
        </DSPage>
    );
}

export default PersonalPage;
