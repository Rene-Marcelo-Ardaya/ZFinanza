import React from 'react';
import { Pencil, Trash2, Mail, User } from 'lucide-react';
import { DSBadge, SecuredButton } from '../../../../ds-components';
import './UsuarioCard.css';

export function UsuarioCard({ user, onEdit, onDelete }) {
    const isActive = user.is_active === true || user.is_active === 1 || user.is_active === 'Activo';

    return (
        <div className={`usuario-card ${!isActive ? 'usuario-card--inactivo' : ''}`}>
            <div className="usuario-card__header">
                <div className="usuario-card__avatar">
                    <User size={20} />
                </div>
                <div className="usuario-card__info">
                    <h3 className="usuario-card__nombre">{user.name}</h3>
                    <div className="usuario-card__email">
                        <Mail size={12} />
                        <span>{user.email}</span>
                    </div>
                </div>
                <DSBadge variant={isActive ? 'success' : 'error'} size="sm">
                    {isActive ? 'Activo' : 'Inactivo'}
                </DSBadge>
            </div>

            <div className="usuario-card__body">
                <div className="usuario-card__meta">
                    <span className="usuario-card__label">ID:</span>
                    <span className="usuario-card__value">#{user.id}</span>
                </div>
                <div className="usuario-card__meta">
                    <span className="usuario-card__label">Rol:</span>
                    <span className="usuario-card__value">{user.roles || '-'}</span>
                </div>
            </div>

            <div className="usuario-card__footer">
                <div className="usuario-card__actions">
                    <SecuredButton
                        securityId="usuarios.editar"
                        securityDesc="Editar usuario"
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(user)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="usuarios.eliminar"
                        securityDesc="Eliminar usuario"
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(user)}
                        title="Eliminar"
                    />
                </div>
            </div>
        </div>
    );
}

export default UsuarioCard;
