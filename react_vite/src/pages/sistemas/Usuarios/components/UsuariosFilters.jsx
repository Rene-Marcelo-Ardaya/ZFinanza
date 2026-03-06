import React from 'react';
import { Search, Filter, X, Shield, Activity } from 'lucide-react';

export function UsuariosFilters({
    searchText,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    roles,
    statusFilter,
    onStatusFilterChange,
    onClearFilters,
    hasActiveFilters
}) {
    return (
        <div className="usuarios-filters">
            <div className="usuarios-filters__search">
                <Search size={18} className="usuarios-filters__search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por usuario o personal..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="usuarios-filters__search-input"
                />
                {searchText && (
                    <button
                        className="usuarios-filters__clear-search"
                        onClick={() => onSearchChange('')}
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="usuarios-filters__select-wrapper">
                <Shield size={18} className="usuarios-filters__select-icon" />
                <select
                    className="usuarios-filters__select"
                    value={roleFilter}
                    onChange={(e) => onRoleFilterChange(e.target.value)}
                >
                    <option value="">Todos los Roles</option>
                    {roles.map(role => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="usuarios-filters__select-wrapper">
                <Activity size={18} className="usuarios-filters__select-icon" />
                <select
                    className="usuarios-filters__select"
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
                    className="usuarios-filters__clear-all"
                    onClick={onClearFilters}
                >
                    <X size={14} />
                    Limpiar filtros
                </button>
            )}

            <div className="usuarios-filters__badge">
                <Filter size={14} />
                {hasActiveFilters ? 'Filtros activos' : 'Sin filtros'}
            </div>
        </div>
    );
}
