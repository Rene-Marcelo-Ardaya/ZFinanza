import React, { useMemo } from 'react';
import { Users, Pencil, Trash2 } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    DSBadge,
    DSCount,
    SecuredButton
} from '../../../../ds-components';
import { CargosFilters } from './CargosFilters';
import { CargoCard } from './CargoCard';
import './CargosFilters.css';

export function CargosTable({
    cargos,
    loading,
    onEdit,
    onDelete,
    onRefresh,
    // Filter Props
    searchText,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onViewPersonal
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
            width: '5%'
        },
        {
            header: 'Nombre',
            accessor: 'nombre',
            width: '25%',
            render: (value) => <strong>{value}</strong>
        },
        {
            header: 'Descripción',
            accessor: 'descripcion',
            width: '40%',
            render: (value) => value || '-'
        },
        {
            header: 'Personal',
            accessor: 'personal_count',
            width: '10%',
            align: 'center',
            render: (value, cargo) => (
                <div
                    onClick={() => cargo.personal_count > 0 && onViewPersonal(cargo)}
                    style={{
                        cursor: cargo.personal_count > 0 ? 'pointer' : 'default',
                        display: 'inline-block'
                    }}
                    title={cargo.personal_count > 0 ? 'Ver personal' : ''}
                >
                    <DSCount variant="purple" icon={<Users size={12} />}>
                        {value}
                    </DSCount>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: 'is_active',
            width: '10%',
            render: (value) => (
                <DSBadge variant={value ? 'success' : 'error'}>
                    {value ? 'Activo' : 'Inactivo'}
                </DSBadge>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '10%',
            render: (_, cargo) => (
                <div className="ds-table__actions">
                    <SecuredButton
                        securityId="cargos.editar"
                        securityDesc="Editar cargo"
                        size="sm"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(cargo)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="cargos.eliminar"
                        securityDesc="Eliminar cargo"
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(cargo)}
                        title="Eliminar"
                        disabled={cargo.personal_count > 0}
                    />
                </div>
            )
        }
    ], [onEdit, onDelete, onViewPersonal]);

    // Función para renderizar card en vista móvil
    const renderCard = (cargo) => (
        <CargoCard
            key={cargo.id}
            cargo={cargo}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewPersonal={onViewPersonal}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando cargos..." />;
    }

    return (
        <DSResponsiveTable
            data={cargos}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage={hasActiveFilters
                ? 'No se encontraron cargos con esos criterios'
                : 'No hay cargos registrados'}
            onRefresh={onRefresh}
            pageSize={25}
        >
            {/* Filtros - Se muestran antes de la tabla/cards */}
            <CargosFilters
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

export default CargosTable;
