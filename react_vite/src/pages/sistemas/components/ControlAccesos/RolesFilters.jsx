import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export function RolesFilters({
    searchText,
    onSearchChange,
    onClearFilters,
    hasActiveFilters
}) {
    return (
        <div className="roles-filters">
            <div className="roles-filters__search">
                <Search size={18} className="roles-filters__search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre de rol..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="roles-filters__search-input"
                />
                {searchText && (
                    <button
                        className="roles-filters__clear-search"
                        onClick={() => onSearchChange('')}
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {hasActiveFilters && (
                <button
                    className="roles-filters__clear-all"
                    onClick={onClearFilters}
                >
                    <X size={14} />
                    Limpiar filtros
                </button>
            )}

            <div className="roles-filters__badge">
                <Filter size={14} />
                {hasActiveFilters ? 'Filtros activos' : 'Sin filtros'}
            </div>
        </div>
    );
}
