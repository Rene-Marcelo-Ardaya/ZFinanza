import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Briefcase, Phone } from 'lucide-react';
import {
    DSResponsiveTable,
    DSLoading,
    SecuredButton
} from '../../../../ds-components';
import { PersonalFilters } from './PersonalFilters';
import { PersonalCard } from './PersonalCard';
import './PersonalFilters.css';

export function PersonalTable({
    personal,
    loading,
    onEdit,
    onDelete,
    onRefresh,
    cargos,
    cargoFilter,
    setCargoFilter
}) {
    const [searchTerm, setSearchTerm] = useState('');

    // Verificar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchTerm !== '' || cargoFilter !== '';
    }, [searchTerm, cargoFilter]);

    // Ordenar por nombre alfabeticamente
    const personalOrdenado = useMemo(() => {
        return [...personal].sort((a, b) =>
            (a.nombre_completo || '').localeCompare(b.nombre_completo || '')
        );
    }, [personal]);

    // Filtrar por búsqueda y cargo
    const personalFiltrado = useMemo(() => {
        let result = personalOrdenado;

        // Filtrar por texto de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(emp =>
                (emp.nombre_completo || '').toLowerCase().includes(term) ||
                (emp.ci || '').toLowerCase().includes(term) ||
                (emp.telefono || '').includes(term)
            );
        }

        // Filtrar por cargo
        if (cargoFilter) {
            result = result.filter(emp => emp.cargo_id === parseInt(cargoFilter));
        }

        return result;
    }, [personalOrdenado, searchTerm, cargoFilter]);

    // Limpiar todos los filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setCargoFilter('');
    };

    // Columnas para vista desktop
    const columns = useMemo(() => [
        {
            header: 'Nombre Completo',
            accessor: 'nombre_completo',
            width: '25%',
            render: (value) => <strong style={{ textTransform: 'uppercase' }}>{value}</strong>
        },
        {
            header: 'CI',
            accessor: 'ci',
            width: '12%'
        },
        {
            header: 'Cargo',
            accessor: 'cargo_nombre',
            width: '18%',
            render: (value) => (
                <span className="personal-cargo-badge">
                    <Briefcase size={12} />
                    {value}
                </span>
            )
        },
        {
            header: 'Telefono',
            accessor: 'telefono',
            width: '15%',
            render: (value) => value ? (
                <span className="personal-contact">
                    <Phone size={12} />
                    {value}
                </span>
            ) : '-'
        },
        {
            header: 'Ingreso',
            accessor: 'fecha_ingreso',
            width: '12%'
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            width: '18%',
            render: (_, emp) => (
                <div className="ds-table__actions">
                    <SecuredButton
                        securityId="personal.editar"
                        securityDesc="Editar empleado"
                        size="sm"
                        iconOnly
                        icon={<Pencil size={15} />}
                        onClick={() => onEdit(emp)}
                        title="Editar"
                    />
                    <SecuredButton
                        securityId="personal.desactivar"
                        securityDesc="Desactivar empleado"
                        size="sm"
                        variant="outline-danger"
                        iconOnly
                        icon={<Trash2 size={15} />}
                        onClick={() => onDelete(emp)}
                        title="Desactivar"
                    />
                </div>
            )
        }
    ], [onEdit, onDelete]);

    // Función para renderizar card en vista móvil
    const renderCard = (emp) => (
        <PersonalCard
            key={emp.id}
            empleado={emp}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );

    if (loading) {
        return <DSLoading text="Cargando personal..." />;
    }

    return (
        <DSResponsiveTable
            data={personalFiltrado}
            columns={columns}
            renderCard={renderCard}
            loading={loading}
            emptyMessage={hasActiveFilters
                ? 'No se encontraron empleados con esos criterios'
                : 'No hay personal registrado'}
            onRefresh={onRefresh}
            pageSize={25}
        >
            {/* Filtros - Se muestran antes de la tabla/cards */}
            <PersonalFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                cargoFilter={cargoFilter}
                onCargoFilterChange={setCargoFilter}
                cargos={cargos}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />
        </DSResponsiveTable>
    );
}

export default PersonalTable;
