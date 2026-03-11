import React from 'react';
import { Plus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    SecuredButton
} from '../../../../ds-components';

import './CuentasPage.css';

// Hook
import { useCuentas } from './hooks/useCuentas';

// Components
import { CuentasTable } from './components/CuentasTable';
import { CuentasFormModal } from './components/CuentasFormModal';

export function CuentasPage() {
    const cuentasLogic = useCuentas();

    return (
        <DSPage>
            <DSPageHeader
                title="Cuentas"
                actions={
                    <SecuredButton
                        securityId="finanzas.cuentas.crear"
                        securityDesc="Crear nueva cuenta"
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={cuentasLogic.openCreate}
                    >
                        Nueva Cuenta
                    </SecuredButton>
                }
            />

            {cuentasLogic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => cuentasLogic.setFormSuccess(null)} className="cuentas-alert-margin">
                    {cuentasLogic.formSuccess}
                </DSAlert>
            )}
            {cuentasLogic.error && (
                <DSAlert variant="error" className="cuentas-alert-margin">
                    {cuentasLogic.error}
                </DSAlert>
            )}

            <CuentasTable
                cuentas={cuentasLogic.cuentas}
                loading={cuentasLogic.loading}
                onEdit={cuentasLogic.openEdit}
                onDelete={cuentasLogic.handleDelete}
                onRefresh={cuentasLogic.refetch}
            />

            <CuentasFormModal
                isOpen={cuentasLogic.modalOpen}
                onClose={cuentasLogic.closeModal}
                isEditing={!!cuentasLogic.editingCuenta}
                form={cuentasLogic.form}
                onChange={cuentasLogic.handleChange}
                onSave={cuentasLogic.handleSave}
                saving={cuentasLogic.saving}
                error={cuentasLogic.formError}
            />
        </DSPage>
    );
}

export default CuentasPage;
