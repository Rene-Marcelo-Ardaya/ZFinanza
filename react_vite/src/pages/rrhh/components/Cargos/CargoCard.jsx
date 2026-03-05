import React from 'react';
import { Users, Pencil, Trash2 } from 'lucide-react';
import { DSBadge, DSCount, SecuredButton } from '../../../../ds-components';
import './CargoCard.css';

export function CargoCard({ cargo, onEdit, onDelete, onViewPersonal }) {
    const isActive = cargo.is_active === true || cargo.is_active === 1;

    return (
        <div className={`cargo-card ${!isActive ? 'cargo-card--inactivo' : ''}`}>
            <div className="cargo-card__header">
                <div className="cargo-card__id">#{cargo.id}</div>
                <DSBadge variant={isActive ? 'success' : 'error'} size="sm">
                    {isActive ? 'Activo' : 'Inactivo'}
                </DSBadge>
            </div>

            <div className="cargo-card__body">
                <h3 className="cargo-card__nombre">{cargo.nombre}</h3>
                {cargo.descripcion && (
                    <p className="cargo-card__descripcion">{cargo.descripcion}</p>
                )}
            </div>

            <div className="cargo-card__stats">
                <div
                    className={`cargo-card__stat ${cargo.personal_count > 0 ? 'cargo-card__stat--clickable' : ''}`}
                    onClick={() => cargo.personal_count > 0 && onViewPersonal(cargo)}
                >
                    <Users size={14} />
                    <DSCount variant="purple">{cargo.personal_count}</DSCount>
                    <span>empleados</span>
                </div>
            </div>

            <div className="cargo-card__footer">
                <div className="cargo-card__actions">
                    <SecuredButton
                        securityId="cargos.editar"
                        securityDesc="Editar cargo"
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(cargo)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="cargos.eliminar"
                        securityDesc="Eliminar cargo"
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(cargo)}
                        title="Eliminar"
                        disabled={cargo.personal_count > 0}
                    />
                </div>
            </div>
        </div>
    );
}

export default CargoCard;
