import React from 'react';
import { DSModal, DSModalSection, DSModalGrid } from './DSModal';
import { Info } from 'lucide-react';

/**
 * DSModalInfo
 * Modal especializado para mostrar información detallada de un registro.
 * 
 * @param {boolean} isOpen - Controla la visibilidad del modal
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Object} data - Objeto con los datos a mostrar (fila seleccionada)
 * @param {Array} columns - Configuración de columnas (misma estructura que DSTable)
 *                          Se usa para obtener el header (label) y formatear el valor.
 * @param {string} title - Título del modal
 */
export function DSModalInfo({
    isOpen,
    onClose,
    data,
    columns = [],
    title = "Información Detallada"
}) {
    if (!data) return null;

    // Helper para obtener el valor formateado usando la lógica de render de la columna o el accessor
    const renderValue = (col, row) => {
        // Ignorar columnas de acciones
        if (col.accessor === 'actions' || col.sticky === 'right') return null;

        let value;
        if (typeof col.accessor === 'function') {
            value = col.accessor(row);
        } else {
            value = row[col.accessor];
        }

        if (col.render) {
            return col.render(value, row);
        }

        // Manejo básico de nulos/undefined
        if (value === null || value === undefined) return '-';
        return value;
    };

    return (
        <DSModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={<Info size={20} />}
            size="md"
        >
            <DSModalSection>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {columns.map((col, idx) => {
                        // Skip actions column logic inside map too
                        if (col.accessor === 'actions' || col.sticky === 'right') return null;

                        // Si el header es un componente complejo (ReactNode), intentamos renderizarlo, 
                        // pero para un label de "Info" a veces es mejor texto plano. 
                        // Asumiremos que se puede renderizar tal cual.

                        return (
                            <div key={idx} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderBottom: '1px solid var(--ds-fieldBorder, #e5e7eb)',
                                paddingBottom: '8px'
                            }}>
                                <span style={{
                                    fontSize: 'var(--ds-font-2xs)',
                                    color: 'var(--ds-secondaryText, #6b7280)',
                                    marginBottom: '4px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                }}>
                                    {col.header}
                                </span>
                                <div style={{ fontSize: 'var(--ds-font-md)', color: 'var(--ds-text-primary, #111827)' }}>
                                    {renderValue(col, data)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DSModalSection>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                    className="ds-btn ds-btn--secondary"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </DSModal>
    );
}
