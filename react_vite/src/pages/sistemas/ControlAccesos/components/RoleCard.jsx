import React from 'react';
import { Pencil, Trash2, Users, Menu } from 'lucide-react';
import { DSBadge, DSCount, DSCode, SecuredButton } from '../../../../ds-components';
import './RoleCard.css';

export function RoleCard({ role, onEdit, onDelete, onViewMenus, onViewUsers }) {
    const isActive = role.is_active === true || role.is_active === 1;

    return (
        <div className={`role-card ${!isActive ? 'role-card--inactivo' : ''}`}>
            <div className="role-card__header">
                <div className="role-card__id">#{role.id}</div>
                <DSBadge variant={isActive ? 'success' : 'error'} size="sm">
                    {isActive ? 'Activo' : 'Inactivo'}
                </DSBadge>
            </div>

            <div className="role-card__body">
                <h3 className="role-card__nombre">{role.name}</h3>
                <div className="role-card__slug">
                    <DSCode>{role.slug}</DSCode>
                </div>
                {role.description && (
                    <p className="role-card__descripcion">{role.description}</p>
                )}
            </div>

            <div className="role-card__stats">
                <div
                    className="role-card__stat role-card__stat--clickable"
                    onClick={() => onViewMenus(role)}
                >
                    <Menu size={14} />
                    <DSCount>{role.menus_count}</DSCount>
                    <span>menús</span>
                </div>
                <div
                    className={`role-card__stat ${role.users_count > 0 ? 'role-card__stat--clickable' : ''}`}
                    onClick={() => role.users_count > 0 && onViewUsers(role)}
                >
                    <Users size={14} />
                    <DSCount variant="purple">{role.users_count}</DSCount>
                    <span>usuarios</span>
                </div>
            </div>

            <div className="role-card__footer">
                <div className="role-card__actions">
                    <SecuredButton
                        securityId="accesos.editar"
                        securityDesc="Editar rol"
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(role)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="accesos.eliminar"
                        securityDesc="Eliminar rol"
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(role)}
                        title="Eliminar"
                        disabled={role.users_count > 0}
                    />
                </div>
            </div>
        </div>
    );
}

export default RoleCard;
