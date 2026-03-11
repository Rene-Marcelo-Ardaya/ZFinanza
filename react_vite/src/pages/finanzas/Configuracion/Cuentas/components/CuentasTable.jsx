import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Search, X } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    SecuredButton,
    DSBadge
} from '../../../../../ds-components';
import './CuentasTable.css';

// Components
import { CuentaCard } from './CuentaCard';

export function CuentasTable({
    cuentas,
    loading,
    onEdit,
    onDelete,
    onRefresh
}) {
    const [searchTerm, setSearchTerm] = useState('');

    // Verificar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchTerm !== '';
    }, [searchTerm]);

    // Ordenar por nombre alfabéticamente
    const cuentasOrdenadas = useMemo(() => {
        return [...cuentas].sort((a, b) =>
            (a.nombre || '').localeCompare(b.nombre || '')
        );
    }, [cuentas]);

    // Filtrar por búsqueda
    const cuentasFiltradas = useMemo(() => {
        let result = cuentasOrdenadas;

        // Filtrar por texto de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(cuenta =>
                (cuenta.nombre || '').toLowerCase().includes(term) ||
                (cuenta.descripcion || '').toLowerCase().includes(term)
            );
        }

        return result;
    }, [cuentasOrdenadas, searchTerm]);

    // Limpiar filtros
    const handleClearFilters = () => {
        setSearchTerm('');
    };

    // Columnas para vista desktop
    const columns = useMemo(() => [
        {
            header: 'Nombre',
            accessor: 'nombre',
            width: '30%',
            render: (value) => <strong>{value}</strong>
        },
        {
            header: 'Descripción',
            accessor: 'descripcion',
            width: '45%',
            render: (value) => value || '-'
        },
        {
            header: 'Estado',
            accessor: 'is_active',
            width: '12%',
            render: (value) => (
                <DSBadge variant={value ? 'success' : 'secondary'}>
                    {value ? 'Activo' : 'Inactivo'}
                </DSBadge>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '13%',
            render: (_, cuenta) => (
                <div className="ds-table__actions">
                    <SecuredButton
                        securityId="finanzas.cuentas.editar"
                        securityDesc="Editar cuenta"
                        size="sm"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(cuenta)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="finanzas.cuentas.desactivar"
                        securityDesc="Desactivar cuenta"
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(cuenta)}
                        title="Desactivar"
                    />
                </div>
            )
        }
    ], [onEdit, onDelete]);

    // Función para renderizar card en vista móvil
    const renderCard = (cuenta) => (
        <CuentaCard
            key={cuenta.id}
            cuenta={cuenta}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando cuentas..." />;
    }

    return (
        <DSResponsiveTable
            data={cuentasFiltradas}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage={hasActiveFilters
                ? 'No se encontraron cuentas con esos criterios'
                : 'No hay cuentas registradas'}
            onRefresh={onRefresh}
            pageSize={25}
        >
            {/* Filtros - Se muestran antes de la tabla/cards */}
            <div className="cuentas-filters">
                <div className="cuentas-filters__search">
                    <Search size={16} className="cuentas-filters__search-icon" />
                    <input
                        type="text"
                        className="ds-field__control"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            className="cuentas-filters__clear"
                            onClick={handleClearFilters}
                            title="Limpiar búsqueda"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
        </DSResponsiveTable>
    );
}

export default CuentasTable;
