import React, { useMemo } from 'react';
import { Pencil, Trash2, Users, Menu } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    DSBadge,
    DSCount,
    DSCode,
    SecuredButton
} from '../../../../ds-components';
import { RolesFilters } from './RolesFilters';
import { RoleCard } from './RoleCard';
import './RolesFilters.css';

export function RolesTable({
    roles,
    loading,
    onEdit,
    onDelete,
    onRefresh,
    // Filter Props
    searchText,
    onSearchChange,
    // View Handlers
    onViewMenus,
    onViewUsers
}) {
    const hasActiveFilters = !!searchText;

    const handleClearFilters = () => {
        onSearchChange('');
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
            accessor: 'name',
            width: '20%',
            render: (value) => <strong>{value}</strong>
        },
        {
            header: 'Identificador',
            accessor: 'slug',
            width: '15%',
            render: (value) => <DSCode>{value}</DSCode>
        },
        {
            header: 'Descripción',
            accessor: 'description',
            width: '25%',
            render: (value) => value || '-'
        },
        {
            header: 'Menús',
            accessor: 'menus_count',
            width: '8%',
            align: 'center',
            render: (value, row) => (
                <div
                    onClick={() => onViewMenus(row)}
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    title="Ver menús permitidos"
                >
                    <DSCount>{value}</DSCount>
                </div>
            )
        },
        {
            header: 'Usuarios',
            accessor: 'users_count',
            width: '8%',
            align: 'center',
            render: (value, row) => (
                <div
                    onClick={() => value > 0 && onViewUsers(row)}
                    style={{
                        cursor: value > 0 ? 'pointer' : 'default',
                        display: 'inline-block'
                    }}
                    title={value > 0 ? 'Ver usuarios asignados' : ''}
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
            width: '8%',
            render: (value) => (
                <DSBadge variant={value == 1 || value === true ? 'success' : 'error'}>
                    {value == 1 || value === true ? 'Activo' : 'Inactivo'}
                </DSBadge>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '11%',
            render: (_, role) => (
                <div className="ds-table__actions">
                    <SecuredButton
                        securityId="accesos.editar"
                        securityDesc="Editar rol"
                        size="sm"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(role)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="accesos.eliminar"
                        securityDesc="Eliminar rol"
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(role)}
                        title="Eliminar"
                        disabled={role.users_count > 0}
                    />
                </div>
            )
        }
    ], [onEdit, onDelete, onViewMenus, onViewUsers]);

    // Función para renderizar card en vista móvil
    const renderCard = (role) => (
        <RoleCard
            key={role.id}
            role={role}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewMenus={onViewMenus}
            onViewUsers={onViewUsers}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando roles..." />;
    }

    return (
        <DSResponsiveTable
            data={roles}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage={hasActiveFilters
                ? 'No se encontraron roles con ese nombre'
                : 'No hay roles registrados'}
            onRefresh={onRefresh}
            pageSize={25}
        >
            {/* Filtros - Se muestran antes de la tabla/cards */}
            <RolesFilters
                searchText={searchText}
                onSearchChange={onSearchChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />
        </DSResponsiveTable>
    );
}

export default RolesTable;
