import React from 'react';
import { Shield, Plus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    DSButton
} from '../../ds-components';

import './NivelesSeguridadPage.css';

// Hook
import { useNivelesSeguridad } from './hooks/useNivelesSeguridad';

// Components
import { NivelesTable } from './components/NivelesSeguridad/NivelesTable';
import { NivelFormModal } from './components/NivelesSeguridad/NivelFormModal';
import { MiembrosModal } from './components/NivelesSeguridad/MiembrosModal';

export function NivelesSeguridadPage() {
    const logic = useNivelesSeguridad();

    return (
        <DSPage>
            {/* HEADER */}
            <DSPageHeader
                title="Grupos de Seguridad"
                icon={<Shield size={22} />}
                actions={
                    <DSButton variant="primary" icon={<Plus size={16} />} onClick={logic.openCreate}>
                        Nuevo Grupo
                    </DSButton>
                }
            />

            {/* ALERTAS */}
            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="niveles-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="niveles-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            {/* TABLA DE NIVELES */}
            <NivelesTable
                niveles={logic.niveles}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onManageMembers={logic.openMiembros}
                onRefresh={logic.refetch}
            />

            {/* MODAL CREAR/EDITAR */}
            <NivelFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingNivel}
                form={logic.form}
                setForm={logic.setForm}
                onChange={logic.handleChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
            />

            {/* MODAL MIEMBROS */}
            <MiembrosModal
                isOpen={logic.miembrosModalOpen}
                onClose={() => logic.setMiembrosModalOpen(false)}
                nivel={logic.selectedNivel}
                onUpdate={logic.refetch}
            />
        </DSPage>
    );
}

export default NivelesSeguridadPage;
