import React from 'react';
import { Search, Filter, X, Briefcase } from 'lucide-react';

export function PersonalFilters({
    searchTerm,
    onSearchChange,
    cargoFilter,
    onCargoFilterChange,
    cargos,
    onClearFilters,
    hasActiveFilters
}) {
    return (
        <div className="personal-filters">
            <div className="personal-filters__search">
                <Search size={18} className="personal-filters__search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, CI o teléfono..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="personal-filters__search-input"
                />
                {searchTerm && (
                    <button
                        className="personal-filters__clear-search"
                        onClick={() => onSearchChange('')}
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="personal-filters__select-wrapper">
                <Briefcase size={18} className="personal-filters__select-icon" />
                <select
                    className="personal-filters__select"
                    value={cargoFilter}
                    onChange={(e) => onCargoFilterChange(e.target.value)}
                >
                    <option value="">Todos los cargos</option>
                    {cargos.map(cargo => (
                        <option key={cargo.id} value={cargo.id}>
                            {cargo.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    className="personal-filters__clear-all"
                    onClick={onClearFilters}
                >
                    <X size={14} />
                    Limpiar filtros
                </button>
            )}

            <div className="personal-filters__badge">
                <Filter size={14} />
                {hasActiveFilters ? 'Filtros activos' : 'Sin filtros'}
            </div>
        </div>
    );
}
