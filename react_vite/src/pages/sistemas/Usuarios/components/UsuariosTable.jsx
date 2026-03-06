import React, { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    DSBadge,
    SecuredButton
} from '../../../../ds-components';
import { UsuariosFilters } from './UsuariosFilters';
import { UsuarioCard } from './UsuarioCard';
import './UsuariosFilters.css';

export function UsuariosTable({
    users,
    loading,
    onEdit,
    onDelete,
    onRefresh,
    // Filter props
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    roles
}) {
    const isUserActive = (user) => user.is_active == 1 || user.is_active === true || user.is_active === 'Activo';

    // Verificar filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchText !== '' || roleFilter !== '' || statusFilter !== 'active';
    }, [searchText, roleFilter, statusFilter]);

    // Limpiar filtros
    const handleClearFilters = () => {
        setSearchText('');
        setRoleFilter('');
        setStatusFilter('active');
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
            width: '25%'
        },
        {
            header: 'Email',
            accessor: 'email',
            width: '30%'
        },
        {
            header: 'Rol',
            accessor: 'roles',
            width: '15%',
            render: (value) => value || '-'
        },
        {
            header: 'Estado',
            accessor: 'is_active',
            width: '10%',
            render: (value, user) => (
                <DSBadge variant={isUserActive(user) ? 'success' : 'error'}>
                    {isUserActive(user) ? 'Activo' : 'Inactivo'}
                </DSBadge>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '15%',
            render: (_, user) => (
                <div className="ds-table__actions">
                    <SecuredButton
                        securityId="usuarios.editar"
                        securityDesc="Editar usuario"
                        size="sm"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(user)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="usuarios.eliminar"
                        securityDesc="Eliminar usuario"
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(user)}
                        title="Eliminar"
                    />
                </div>
            )
        }
    ], [onEdit, onDelete]);

    // Función para renderizar card en vista móvil
    const renderCard = (user) => (
        <UsuarioCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando usuarios..." />;
    }

    return (
        <DSResponsiveTable
            data={users}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage={hasActiveFilters
                ? 'No se encontraron usuarios con esos criterios'
                : 'No hay usuarios registrados'}
            onRefresh={onRefresh}
            pageSize={25}
        >
            {/* Filtros - Se muestran antes de la tabla/cards */}
            <UsuariosFilters
                searchText={searchText}
                onSearchChange={setSearchText}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                roles={roles}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />
        </DSResponsiveTable>
    );
}

export default UsuariosTable;
