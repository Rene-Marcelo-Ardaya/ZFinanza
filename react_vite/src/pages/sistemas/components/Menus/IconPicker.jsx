import React, { useState } from 'react';
import { ChevronDown, Menu as MenuIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

function getLucideIcon(iconName) {
    if (!iconName) return MenuIcon;
    const Icon = LucideIcons[iconName];
    return Icon || MenuIcon;
}

export function IconPicker({ icons, value, onChange }) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredIcons = icons.filter(icon =>
        icon.toLowerCase().includes(search.toLowerCase())
    );

    const SelectedIcon = getLucideIcon(value);

    return (
        <div className="menus-icon-picker">
            <button
                type="button"
                className="menus-icon-picker__trigger ds-field__control"
                onClick={() => setIsOpen(!isOpen)}
            >
                <SelectedIcon size={18} />
                <span>{value || 'Seleccionar icono...'}</span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div className="menus-icon-picker__dropdown">
                    <input
                        type="text"
                        className="menus-icon-picker__search"
                        placeholder="Buscar icono..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    <div className="menus-icon-picker__grid">
                        {filteredIcons.slice(0, 48).map(iconName => {
                            const IconComp = getLucideIcon(iconName);
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    className={`menus-icon-picker__item ${value === iconName ? 'is-selected' : ''}`}
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    title={iconName}
                                >
                                    <IconComp size={20} />
                                </button>
                            );
                        })}
                    </div>
                    {filteredIcons.length === 0 && (
                        <div className="menus-icon-picker__empty">
                            No se encontraron iconos
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
