import React from 'react';
import { Shield, Plus } from 'lucide-react';
import {
    DSPage,
    DSPageHeader,
    DSAlert,
    SecuredButton
} from '../../../ds-components';

import './ControlAccesosPage.css';

// Hook
import { useControlAccesos } from './hooks/useControlAccesos';

// Components
import { RolesTable } from './components/RolesTable';
import { RoleFormModal } from './components/RoleFormModal';
import { RoleMenusModal } from './components/RoleMenusModal';
import { RoleUsersModal } from './components/RoleUsersModal';

export function ControlAccesosPage() {
    const logic = useControlAccesos();

    return (
        <DSPage>
            <DSPageHeader
                title="Control de Accesos"
                icon={<Shield size={22} />}
                actions={
                    <SecuredButton
                        securityId="accesos.crear"
                        securityDesc="Crear nuevo rol"
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={logic.openCreate}
                    >
                        Nuevo Rol
                    </SecuredButton>
                }
            />

            {logic.formSuccess && (
                <DSAlert variant="success" dismissible onDismiss={() => logic.setFormSuccess(null)} className="accesos-alert-margin">
                    {logic.formSuccess}
                </DSAlert>
            )}
            {logic.error && (
                <DSAlert variant="error" className="accesos-alert-margin">
                    {logic.error}
                </DSAlert>
            )}

            <RolesTable
                roles={logic.filteredRoles}
                loading={logic.loading}
                onEdit={logic.openEdit}
                onDelete={logic.handleDelete}
                onRefresh={logic.refetch}
                // Filters
                searchText={logic.searchText}
                onSearchChange={logic.setSearchText}
                // Views
                onViewMenus={logic.openMenusModal}
                onViewUsers={logic.openUsersModal}
            />

            <RoleFormModal
                isOpen={logic.modalOpen}
                onClose={logic.closeModal}
                isEditing={!!logic.editingRole}
                form={logic.form}
                setForm={logic.setForm}
                menus={logic.menus}
                onChange={logic.handleChange}
                onNameChange={logic.handleNameChange}
                onSave={logic.handleSave}
                saving={logic.saving}
                error={logic.formError}
            />

            <RoleMenusModal
                isOpen={logic.menusModalOpen}
                onClose={logic.closeMenusModal}
                role={logic.selectedRoleForMenus}
                roleMenus={logic.roleMenus}
                allMenus={logic.menus}
                loading={logic.loading} // Usando loading general por ahora tras reset
            />

            <RoleUsersModal
                isOpen={logic.usersModalOpen}
                onClose={logic.closeUsersModal}
                role={logic.selectedRoleForUsers}
                users={logic.roleUsers}
                loading={logic.loadingRoleUsers}
            />
        </DSPage>
    );
}

export default ControlAccesosPage;
