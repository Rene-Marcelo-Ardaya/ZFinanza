import React from 'react';
import { Search, Filter, X, Activity } from 'lucide-react';

export function NegociosFilters({
    searchText,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onClearFilters,
    hasActiveFilters
}) {
    return (
        <div className="negocios-filters">
            <div className="negocios-filters__search">
                <Search size={18} className="negocios-filters__search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre de negocio..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="negocios-filters__search-input"
                />
                {searchText && (
                    <button
                        className="negocios-filters__clear-search"
                        onClick={() => onSearchChange('')}
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="negocios-filters__select-wrapper">
                <Activity size={18} className="negocios-filters__select-icon" />
                <select
                    className="negocios-filters__select"
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
                    className="negocios-filters__clear-all"
                    onClick={onClearFilters}
                >
                    <X size={14} />
                    Limpiar filtros
                </button>
            )}

            <div className="negocios-filters__badge">
                <Filter size={14} />
                {hasActiveFilters ? 'Filtros activos' : 'Sin filtros'}
            </div>
        </div>
    );
}

export default NegociosFilters;
