import React, { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    DSBadge,
    SecuredButton
} from '../../../../ds-components';
import { NegociosFilters } from './NegociosFilters';
import { NegocioCard } from './NegocioCard';

export function NegociosTable({
    negocios,
    loading,
    onEdit,
    onDelete,
    onRefresh,
    // Filter Props
    searchText,
    onSearchChange,
    statusFilter,
    onStatusFilterChange
}) {
    // Verificar filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchText !== '' || statusFilter !== 'active';
    }, [searchText, statusFilter]);

    // Limpiar filtros
    const handleClearFilters = () => {
        onSearchChange('');
        onStatusFilterChange('active');
    };

    // Columnas para vista desktop
    const columns = useMemo(() => [
        {
            header: 'ID',
            accessor: 'id',
            width: '10%'
        },
        {
            header: 'Nombre',
            accessor: 'nombre',
            width: '60%',
            render: (value) => <strong>{value}</strong>
        },
        {
            header: 'Estado',
            accessor: 'is_active',
            width: '15%',
            render: (value) => (
                <DSBadge variant={value ? 'success' : 'error'}>
                    {value ? 'Activo' : 'Inactivo'}
                </DSBadge>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '15%',
            render: (_, negocio) => (
                <div className="ds-table__actions">
                    <SecuredButton
                        securityId="negocios.editar"
                        securityDesc="Editar negocio"
                        size="sm"
                        variant="outline-primary"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(negocio)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="negocios.eliminar"
                        securityDesc="Eliminar negocio"
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(negocio)}
                        title="Eliminar"
                    />
                </div>
            )
        }
    ], [onEdit, onDelete]);

    // Función para renderizar card en vista móvil
    const renderCard = (negocio) => (
        <NegocioCard
            key={negocio.id}
            negocio={negocio}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando negocios..." />;
    }

    return (
        <DSResponsiveTable
            data={negocios}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage={hasActiveFilters
                ? 'No se encontraron negocios con esos criterios'
                : 'No hay negocios registrados'}
            onRefresh={onRefresh}
            pageSize={25}
        >
            {/* Filtros - Se muestran antes de la tabla/cards */}
            <NegociosFilters
                searchText={searchText}
                onSearchChange={onSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={onStatusFilterChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />
        </DSResponsiveTable>
    );
}

export default NegociosTable;
