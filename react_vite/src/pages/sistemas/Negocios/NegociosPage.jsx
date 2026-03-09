import React from 'react';
import { Building2, Plus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    SecuredButton
} from '../../../ds-components';

import './NegociosPage.css';

// Hook
import { useNegocios } from './hooks/useNegocios';

// Components
import { NegociosTable } from './components/NegociosTable';
import { NegocioFormModal } from './components/NegocioFormModal';

export function NegociosPage() {
    const logic = useNegocios();

    return (
        <DSPage>
            <DSPageHeader
                title="Gestión de Negocios"
                icon={<Building2 size={22} />}
                actions={
                    <SecuredButton
                        securityId="negocios.crear"
                        securityDesc="Crear nuevo negocio"
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={logic.openCreate}
                    >
                        Nuevo Negocio
                    </SecuredButton>
                }
            />

            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="negocios-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="negocios-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            <NegociosTable
                negocios={logic.filteredNegocios}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onRefresh={logic.refetch}
                // Filter Props
                searchText={logic.searchText}
                onSearchChange={logic.setSearchText}
                statusFilter={logic.statusFilter}
                onStatusFilterChange={logic.setStatusFilter}
            />

            <NegocioFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingNegocio}
                form={logic.form}
                onChange={logic.handleChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
            />
        </DSPage>
    );
}

export default NegociosPage;
