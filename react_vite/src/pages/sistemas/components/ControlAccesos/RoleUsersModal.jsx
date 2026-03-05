import React from 'react';
import { Users } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSLoading,
    DSBadge
} from '../../../../ds-components';

export function RoleUsersModal({
    isOpen,
    onClose,
    role,
    users,
    loading
}) {
    const roleTitle = role ? `Usuarios con Rol: ${role.name}` : 'Usuarios del Rol';

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={roleTitle}
            size="lg"
            footer={
                <DSButton onClick={onClose}>
                    Cerrar
                </DSButton>
            }
        >
            <div className="role-users-content">
                {loading ? (
                    <DSLoading text="Cargando usuarios..." />
                ) : users.length === 0 ? (
                    <div className="ds-empty-state" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <p>No hay usuarios asignados a este rol.</p>
                    </div>
                ) : (
                    <div className="ds-table-wrapper">
                        <table className="ds-table ds-table--striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td><strong>{u.name}</strong></td>
                                        <td>{u.email}</td>
                                        <td>
                                            <DSBadge variant={u.is_active == 1 || u.is_active === true || u.is_active === 'Activo' ? 'success' : 'error'}>
                                                {u.is_active == 1 || u.is_active === true || u.is_active === 'Activo' ? 'Activo' : 'Inactivo'}
                                            </DSBadge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DSModal>
    );
}
