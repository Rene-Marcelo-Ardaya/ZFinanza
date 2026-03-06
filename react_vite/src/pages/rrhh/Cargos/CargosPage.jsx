import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    SecuredButton
} from '../../../ds-components';

import './CargosPage.css';

// Hook
import { useCargos } from './hooks/useCargos';

// Components
import { CargosTable } from './components/CargosTable';
import { CargoFormModal } from './components/CargoFormModal';
import { PersonalPorCargoModal } from './components/PersonalPorCargoModal';

export function CargosPage() {
    const logic = useCargos();

    return (
        <DSPage>
            <DSPageHeader
                title="Gestión de Cargos"
                icon={<Briefcase size={22} />}
                actions={
                    <SecuredButton
                        securityId="cargos.crear"
                        securityDesc="Crear nuevo cargo"
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={logic.openCreate}
                    >
                        Nuevo Cargo
                    </SecuredButton>
                }
            />

            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="cargos-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="cargos-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            <CargosTable
                cargos={logic.filteredCargos}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onRefresh={logic.refetch}
                // Filter Props
                searchText={logic.searchText}
                onSearchChange={logic.setSearchText}
                statusFilter={logic.statusFilter}
                onStatusFilterChange={logic.setStatusFilter}
                // Personal View
                onViewPersonal={logic.openPersonalModal}
            />

            <CargoFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingCargo}
                form={logic.form}
                onChange={logic.handleChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
            />

            <PersonalPorCargoModal
                isOpen={logic.personalModalOpen}
                onClose={logic.closePersonalModal}
                cargo={logic.selectedCargo}
                personal={logic.personalDelCargo}
                loading={logic.loadingPersonal}
            />
        </DSPage>
    );
}

export default CargosPage;
