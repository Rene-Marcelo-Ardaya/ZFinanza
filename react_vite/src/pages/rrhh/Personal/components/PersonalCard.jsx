import React from 'react';
import { Pencil, Trash2, Briefcase, Phone, Calendar } from 'lucide-react';
import { SecuredButton } from '../../../../ds-components';
import './PersonalCard.css';

export function PersonalCard({ empleado, onEdit, onDelete }) {
    return (
        <div className="personal-card">
            <div className="personal-card__header">
                <div className="personal-card__avatar">
                    {empleado.nombre_completo?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="personal-card__info">
                    <h3 className="personal-card__nombre">{empleado.nombre_completo}</h3>
                    <div className="personal-card__ci">CI: {empleado.ci || '-'}</div>
                </div>
            </div>

            <div className="personal-card__body">
                <div className="personal-card__meta">
                    <Briefcase size={14} />
                    <span className="personal-card__cargo">{empleado.cargo_nombre || 'Sin cargo'}</span>
                </div>

                {empleado.telefono && (
                    <div className="personal-card__meta">
                        <Phone size={14} />
                        <span>{empleado.telefono}</span>
                    </div>
                )}

                {empleado.fecha_ingreso && (
                    <div className="personal-card__meta">
                        <Calendar size={14} />
                        <span>Desde {empleado.fecha_ingreso}</span>
                    </div>
                )}
            </div>

            <div className="personal-card__footer">
                <div className="personal-card__actions">
                    <SecuredButton
                        securityId="personal.editar"
                        securityDesc="Editar empleado"
                        size="sm"
                        variant="ghost"
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(empleado)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="personal.desactivar"
                        securityDesc="Desactivar empleado"
                        size="sm"
                        variant="ghost-danger"
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(empleado)}
                        title="Desactivar"
                    />
                </div>
            </div>
        </div>
    );
}

export default PersonalCard;
