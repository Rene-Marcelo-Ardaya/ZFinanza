import React, { useMemo } from 'react';
import { Users, Pencil, Trash2, Layers } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    DSCount,
    DSBadge,
    DSButton
} from '../../../../ds-components';
import { NivelCard } from './NivelCard';

export function NivelesTable({
    niveles,
    loading,
    onEdit,
    onDelete,
    onManageMembers,
    onRefresh
}) {
    // Columnas para vista desktop
    const columns = useMemo(() => [
        {
            header: 'ID',
            accessor: 'id',
            width: '5%'
        },
        {
            header: 'Color',
            accessor: 'color',
            width: '8%',
            render: (value) => (
                <span
                    className="niveles-color-dot"
                    style={{ background: value || '#6b7280' }}
                    title={value}
                />
            )
        },
        {
            header: 'Nombre',
            accessor: 'nombre',
            width: '20%',
            render: (value) => <strong>{value}</strong>
        },
        {
            header: 'Descripción',
            accessor: 'descripcion',
            width: '30%',
            render: (value) => value || '-'
        },
        {
            header: 'Miembros',
            accessor: 'personal_count',
            width: '10%',
            align: 'center',
            render: (value) => (
                <DSCount variant="purple" icon={<Users size={12} />}>
                    {value || 0}
                </DSCount>
            )
        },
        {
            header: 'Componentes',
            accessor: 'componentes_count',
            width: '10%',
            align: 'center',
            render: (value) => (
                <DSCount>{value || 0}</DSCount>
            )
        },
        {
            header: 'Estado',
            accessor: 'is_active',
            width: '8%',
            render: (value) => (
                <DSBadge variant={value ? 'success' : 'error'}>
                    {value ? 'Activo' : 'Inactivo'}
                </DSBadge>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '12%',
            render: (_, nivel) => (
                <div className="ds-table__actions">
                    <DSButton
                        size="sm"
                        iconOnly
                        icon={<Users size={15} />}
                        onClick={() => onManageMembers(nivel)}
                        title="Gestionar Miembros"
                    />
                    <DSButton
                        size="sm"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(nivel)}
                        title="Editar"
                    />
                    <DSButton
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(nivel)}
                        title="Eliminar"
                        disabled={(nivel.personal_count || 0) > 0}
                    />
                </div>
            )
        }
    ], [onEdit, onDelete, onManageMembers]);

    // Función para renderizar card en vista móvil
    const renderCard = (nivel) => (
        <NivelCard
            key={nivel.id}
            nivel={nivel}
            onEdit={onEdit}
            onDelete={onDelete}
            onManageMembers={onManageMembers}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando grupos de seguridad..." />;
    }

    return (
        <DSResponsiveTable
            data={niveles}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage="No hay grupos de seguridad registrados"
            onRefresh={onRefresh}
            pageSize={25}
        />
    );
}

export default NivelesTable;
