import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    SecuredButton
} from '../../ds-components';

import './UsuariosPage.css';

// Hook
import { useUsuarios } from './hooks/useUsuarios';

// Components
import { UsuariosTable } from './components/Usuarios/UsuariosTable';
import { UserFormModal } from './components/Usuarios/UserFormModal';

export function UsuariosPage() {
    const logic = useUsuarios();

    return (
        <DSPage>
            {/* HEADER */}
            <DSPageHeader
                title="Gestión de Usuarios"
                icon={<Users size={22} />}
                actions={
                    <SecuredButton
                        securityId="usuarios.crear"
                        securityDesc="Crear nuevo usuario"
                        variant="primary"
                        icon={<UserPlus size={16} />}
                        onClick={logic.openCreate}
                    >
                        Nuevo Usuario
                    </SecuredButton>
                }
            />

            {/* ALERTAS */}
            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="usuarios-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="usuarios-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            {/* TABLA USERS */}
            <UsuariosTable
                users={logic.filteredUsers}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onRefresh={logic.refetch}
                // Filter Props
                searchText={logic.searchText}
                setSearchText={logic.setSearchText}
                roleFilter={logic.roleFilter}
                setRoleFilter={logic.setRoleFilter}
                statusFilter={logic.statusFilter}
                setStatusFilter={logic.setStatusFilter}
                roles={logic.roles}
            />

            {/* MODAL FORMULARIO */}
            <UserFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingUser}
                form={logic.form}
                roles={logic.roles}
                personal={logic.personal}
                onChange={logic.handleChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
            />
        </DSPage>
    );
}

export default UsuariosPage;
