import React from 'react';
import './DSTable.css';
import { DSLoading, DSBadge, DSModalInfo } from '../ds-components';
import { ChevronRight, ChevronDown } from 'lucide-react';

/**
 * DSTable
 * Componente genérico para tablas en el sistema.
 * 
 * @param {Array} data - Array de objetos con los datos
 * @param {Array} columns - Configuración de columnas
 *   - header: ReactNode
 *   - accessor: string | function(row)
 *   - render: function(value, row)
 *   - width: string
 *   - align: 'left' | 'center' | 'right'
 *   - cellClassName: string | function(value, row)
 * @param {boolean} loading - Estado de carga
 * @param {ReactNode} emptyMessage - Mensaje para estado vacío
 * @param {Function} onRowClick - Click en fila (row) => void
 * @param {string|Function} rowKey - Identificador único de fila (default 'id')
 * @param {string} className - Clase adicional para el wrapper
 * @param {Function} rowStyle - Función para estilos condicionales de fila
 * @param {Function} expandedRowRender - Función (row) => ReactNode para contenido expandible
 */
export function DSTable({
    data = [],
    columns = [],
    loading = false,
    emptyMessage = "No hay registros disponibles",
    onRowClick,
    rowKey = 'id',
    className = '',
    rowStyle,
    expandedRowRender,
    ...props
}) {
    const [expandedRows, setExpandedRows] = React.useState([]);

    // Modal Info Logic
    const [infoModalOpen, setInfoModalOpen] = React.useState(false);
    const [selectedRowData, setSelectedRowData] = React.useState(null);

    const getRowKey = (row, index) => {
        if (typeof rowKey === 'function') return rowKey(row);
        return row[rowKey] || index;
    };

    const getValue = (row, col) => {
        if (typeof col.accessor === 'function') {
            return col.accessor(row);
        }
        return row[col.accessor];
    };

    const toggleRow = (key, e) => {
        e.stopPropagation();
        setExpandedRows(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const handleRowDoubleClick = (row) => {
        if (props.onRowDoubleClick) {
            props.onRowDoubleClick(row);
        } else if (props.enableRowInfo) {
            setSelectedRowData(row);
            setInfoModalOpen(true);
        }
    };

    if (loading) {
        return <DSLoading />;
    }

    if (!data || data.length === 0) {
        return <div className="ds-table-empty">{emptyMessage}</div>;
    }

    return (
        <>
            <div className={`ds-table-wrapper ${className}`}>
                <table className="ds-table">
                    <thead>
                        <tr>
                            {/* Expand Column Header */}
                            {expandedRowRender && (
                                <th className="ds-table-col-expand" style={{ width: '40px' }}></th>
                            )}

                            {/* Mobile Actions Header (Fixed Left) */}
                            {columns.map((col, idx) => {
                                if (col.accessor === 'actions' || col.sticky === 'right') {
                                    return (
                                        <th
                                            key={`mobile-actions-${idx}`}
                                            className="ds-table-col-actions-mobile"
                                            style={{ width: col.width, textAlign: col.align || 'left' }}
                                        >
                                            {col.header}
                                        </th>
                                    );
                                }
                                return null;
                            })}

                            {/* Standard Columns */}
                            {columns.map((col, idx) => {
                                const isActions = col.accessor === 'actions' || col.sticky === 'right';
                                return (
                                    <th
                                        key={idx}
                                        className={isActions ? 'ds-table-col-actions-desktop' : ''} // Only show on desktop if actions
                                        style={{ width: col.width, textAlign: col.align || 'left' }}
                                    >
                                        {col.header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rIdx) => {
                            const key = getRowKey(row, rIdx);
                            const isExpanded = expandedRows.includes(key);
                            const style = rowStyle ? rowStyle(row) : {};

                            return (
                                <React.Fragment key={key}>
                                    <tr
                                        onClick={() => onRowClick && onRowClick(row)}
                                        onDoubleClick={() => handleRowDoubleClick(row)}
                                        className={`${onRowClick || props.enableRowInfo ? 'ds-table-row--clickable' : ''} ${isExpanded ? 'ds-table-row--expanded' : ''}`}
                                        style={style}
                                    >
                                        {/* Expand Toggle Cell */}
                                        {expandedRowRender && (
                                            <td className="ds-table-cell--expand">
                                                <button
                                                    className={`ds-btn-expand ${isExpanded ? 'is-expanded' : ''}`}
                                                    onClick={(e) => toggleRow(key, e)}
                                                >
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            </td>
                                        )}

                                        {/* Mobile Actions Cell (Fixed Left) */}
                                        {columns.map((col, cIdx) => {
                                            if (col.accessor === 'actions' || col.sticky === 'right') {
                                                const value = getValue(row, col);
                                                const content = col.render ? col.render(value, row) : value;
                                                return (
                                                    <td
                                                        key={`mobile-actions-cell-${cIdx}`}
                                                        className="ds-table-col-actions-mobile"
                                                    >
                                                        {content}
                                                    </td>
                                                );
                                            }
                                            return null;
                                        })}

                                        {/* Standard Cells */}
                                        {columns.map((col, cIdx) => {
                                            const value = getValue(row, col);
                                            const content = col.render ? col.render(value, row) : value;
                                            const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '';
                                            const isActions = col.accessor === 'actions' || col.sticky === 'right';

                                            let cellClass = '';
                                            if (typeof col.cellClassName === 'function') {
                                                cellClass = col.cellClassName(value, row);
                                            } else if (col.cellClassName) {
                                                cellClass = col.cellClassName;
                                            }

                                            if (isActions) {
                                                cellClass += ' ds-table-col-actions-desktop';
                                            }

                                            return (
                                                <td
                                                    key={cIdx}
                                                    className={`${alignClass} ${cellClass}`}
                                                >
                                                    {content}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {isExpanded && expandedRowRender && (
                                        <tr className="ds-table-row--detail">
                                            <td colSpan={columns.length + (expandedRowRender ? 1 : 0)}>
                                                {expandedRowRender(row)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {props.enableRowInfo && (
                <DSModalInfo
                    isOpen={infoModalOpen}
                    onClose={() => setInfoModalOpen(false)}
                    data={selectedRowData}
                    columns={columns}
                />
            )}
        </>
    );
}
