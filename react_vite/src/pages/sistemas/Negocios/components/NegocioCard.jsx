import React from 'react';
import { Users, Pencil, Trash2 } from 'lucide-react';
import { DSBadge, SecuredButton } from '../../../../ds-components';
import './NegocioCard.css';

export function NegocioCard({ negocio, onEdit, onDelete }) {
    const isActive = negocio.is_active === true || negocio.is_active === 1;

    return (
        <div className={`negocio-card ${!isActive ? 'negocio-card--inactivo' : ''}`}>
            <div className="negocio-card__header">
                <div className="negocio-card__id">#{negocio.id}</div>
                <DSBadge variant={isActive ? 'success' : 'error'} size="sm">
                    {isActive ? 'Activo' : 'Inactivo'}
                </DSBadge>
            </div>

            <div className="negocio-card__body">
                <h3 className="negocio-card__nombre">{negocio.nombre}</h3>
            </div>

            <div className="negocio-card__footer">
                <div className="negocio-card__actions">
                    <SecuredButton
                        securityId="negocios.editar"
                        securityDesc="Editar negocio"
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(negocio)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="negocios.eliminar"
                        securityDesc="Eliminar negocio"
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(negocio)}
                        title="Eliminar"
                    />
                </div>
            </div>
        </div>
    );
}

export default NegocioCard;
