import React from 'react';
import { Search, Filter, X, Activity } from 'lucide-react';

export function CargosFilters({
    searchText,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onClearFilters,
    hasActiveFilters
}) {
    return (
        <div className="cargos-filters">
            <div className="cargos-filters__search">
                <Search size={18} className="cargos-filters__search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre de cargo..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="cargos-filters__search-input"
                />
                {searchText && (
                    <button
                        className="cargos-filters__clear-search"
                        onClick={() => onSearchChange('')}
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="cargos-filters__select-wrapper">
                <Activity size={18} className="cargos-filters__select-icon" />
                <select
                    className="cargos-filters__select"
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                >
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="all">Todos</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    className="cargos-filters__clear-all"
                    onClick={onClearFilters}
                >
                    <X size={14} />
                    Limpiar filtros
                </button>
            )}

            <div className="cargos-filters__badge">
                <Filter size={14} />
                {hasActiveFilters ? 'Filtros activos' : 'Sin filtros'}
            </div>
        </div>
    );
}
