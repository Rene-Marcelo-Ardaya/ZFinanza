import React from 'react';
import { Users, Pencil, Trash2, Layers } from 'lucide-react';
import { DSBadge, DSCount, DSButton } from '../../../../ds-components';
import './NivelCard.css';

export function NivelCard({ nivel, onEdit, onDelete, onManageMembers }) {
    const isActive = nivel.is_active === true || nivel.is_active === 1;

    return (
        <div className={`nivel-card ${!isActive ? 'nivel-card--inactivo' : ''}`}>
            <div className="nivel-card__header">
                <div className="nivel-card__id">#{nivel.id}</div>
                <div className="nivel-card__color" style={{ backgroundColor: nivel.color || '#6b7280' }} />
                <DSBadge variant={isActive ? 'success' : 'error'} size="sm">
                    {isActive ? 'Activo' : 'Inactivo'}
                </DSBadge>
            </div>

            <div className="nivel-card__body">
                <h3 className="nivel-card__nombre">{nivel.nombre}</h3>
                {nivel.descripcion && (
                    <p className="nivel-card__descripcion">{nivel.descripcion}</p>
                )}
            </div>

            <div className="nivel-card__stats">
                <div className="nivel-card__stat">
                    <Users size={14} />
                    <DSCount variant="purple">{nivel.personal_count || 0}</DSCount>
                    <span>miembros</span>
                </div>
                <div className="nivel-card__stat">
                    <Layers size={14} />
                    <DSCount>{nivel.componentes_count || 0}</DSCount>
                    <span>componentes</span>
                </div>
            </div>

            <div className="nivel-card__footer">
                <div className="nivel-card__actions">
                    <DSButton
                        size="sm"
                        variant="ghost"
                        icon={<Users size={15} />}
                        onClick={() => onManageMembers(nivel)}
                        title="Gestionar Miembros"
                    />
                    <DSButton
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(nivel)}
                        title="Editar"
                    />
                    <DSButton
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(nivel)}
                        title="Eliminar"
                        disabled={(nivel.personal_count || 0) > 0}
                    />
                </div>
            </div>
        </div>
    );
}

export default NivelCard;
