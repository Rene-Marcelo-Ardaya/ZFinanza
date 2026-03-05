import React from 'react';
import { User } from 'lucide-react';
import {
    DSModal,
    DSButton,
    DSLoading
} from '../../../../ds-components';

export function PersonalPorCargoModal({
    isOpen,
    onClose,
    cargo,
    personal,
    loading
}) {
    // Si no hay cargo seleccionado, no renderizar nada útil (o return null antes del modal)
    const cargoTitle = cargo ? `Personal: ${cargo.nombre}` : 'Personal por Cargo';

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={cargoTitle}
            size="lg"
            footer={
                <DSButton onClick={onClose}>
                    Cerrar
                </DSButton>
            }
        >
            <div className="personal-cargo-modal-content">
                {loading ? (
                    <DSLoading text="Cargando personal..." />
                ) : personal.length === 0 ? (
                    <div className="ds-empty-state" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        <User size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <p>No hay personal asignado a este cargo actualmente.</p>
                    </div>
                ) : (
                    <div className="ds-table-wrapper">
                        <table className="ds-table ds-table--striped">
                            <thead>
                                <tr>
                                    <th>Nombre Completo</th>
                                    <th>CI</th>
                                    <th>Teléfono</th>
                                    <th>Fecha Ingreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personal.map(p => (
                                    <tr key={p.id}>
                                        <td><strong>{p.nombre_completo || p.nombre}</strong></td>
                                        <td>{p.ci}</td>
                                        <td>{p.telefono || '-'}</td>
                                        <td>{p.fecha_ingreso || '-'}</td>
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
