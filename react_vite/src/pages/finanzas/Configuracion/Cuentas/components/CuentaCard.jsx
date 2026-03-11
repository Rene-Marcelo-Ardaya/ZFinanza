import React from 'react';
import { Pencil, Trash2, Wallet, Calendar, Hash } from 'lucide-react';
import { DSBadge, SecuredButton } from '../../../../../ds-components';
import './CuentaCard.css';

export function CuentaCard({ cuenta, onEdit, onDelete }) {
    const isActive = cuenta.is_active === true || cuenta.is_active === 1 || cuenta.is_active === 'Activo';

    return (
        <div className={`cuenta-card ${!isActive ? 'cuenta-card--inactivo' : ''}`}>
            <div className="cuenta-card__header">
                <div className="cuenta-card__icon-wrapper">
                    <Wallet size={24} className="cuenta-card__icon" />
                </div>
                <div className="cuenta-card__info">
                    <h3 className="cuenta-card__nombre">{cuenta.nombre}</h3>
                    {cuenta.descripcion && (
                        <p className="cuenta-card__descripcion">{cuenta.descripcion}</p>
                    )}
                </div>
                <DSBadge variant={isActive ? 'success' : 'secondary'} size="sm">
                    {isActive ? 'Activo' : 'Inactivo'}
                </DSBadge>
            </div>

            <div className="cuenta-card__body">
                <div className="cuenta-card__meta">
                    <div className="cuenta-card__meta-item">
                        <Hash size={14} className="cuenta-card__meta-icon" />
                        <span className="cuenta-card__label">ID:</span>
                        <span className="cuenta-card__value">#{cuenta.id}</span>
                    </div>
                    {cuenta.created_at && (
                        <div className="cuenta-card__meta-item">
                            <Calendar size={14} className="cuenta-card__meta-icon" />
                            <span className="cuenta-card__label">Creado:</span>
                            <span className="cuenta-card__value">
                                {new Date(cuenta.created_at).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="cuenta-card__footer">
                <div className="cuenta-card__actions">
                    <SecuredButton
                        securityId="finanzas.cuentas.editar"
                        securityDesc="Editar cuenta"
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(cuenta)}
                        title="Editar"
                    >
                        Editar
                    </SecuredButton>
                    <SecuredButton
                        securityId="finanzas.cuentas.desactivar"
                        securityDesc="Desactivar cuenta"
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(cuenta)}
                        title="Desactivar"
                    >
                        Desactivar
                    </SecuredButton>
                </div>
            </div>
        </div>
    );
}

export default CuentaCard;
