import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, X } from 'lucide-react';

/**
 * DSSearchSelect - Select con buscador integrado
 * 
 * Props:
 * - options: Array de { value, label }
 * - value: Valor seleccionado
 * - onChange: Callback cuando cambia la selección
 * - placeholder: Texto placeholder
 * - searchPlaceholder: Texto del buscador
 * - disabled: Deshabilitar
 * - clearable: Permitir limpiar selección
 */
export function DSSearchSelect({
    options = [],
    value,
    onChange,
    placeholder = 'Seleccionar...',
    searchPlaceholder = 'Buscar...',
    disabled = false,
    clearable = false,
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filtrar opciones por búsqueda
    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const query = search.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(query)
        );
    }, [options, search]);

    // Obtener label del valor actual
    const selectedLabel = useMemo(() => {
        const selected = options.find(opt => String(opt.value) === String(value));
        return selected ? selected.label : '';
    }, [options, value]);

    // Calcular posición del dropdown
    const updateDropdownPosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width
            });
        }
    };

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // También verificar si el click es dentro del portal
                const portal = document.querySelector('.ds-search-select__dropdown-portal');
                if (portal && portal.contains(event.target)) return;
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus en el input de búsqueda al abrir
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Actualizar posición cuando se abre o cambia el scroll
    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
            const handleScroll = () => updateDropdownPosition();
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [isOpen]);

    const handleSelect = (opt) => {
        onChange?.(opt.value);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange?.('');
    };

    const toggleOpen = () => {
        if (!disabled) {
            if (!isOpen) {
                updateDropdownPosition();
            }
            setIsOpen(!isOpen);
            if (!isOpen) setSearch('');
        }
    };

    // Renderizar dropdown en portal
    const renderDropdown = () => {
        if (!isOpen) return null;

        return createPortal(
            <div
                className="ds-search-select__dropdown-portal"
                style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    minWidth: dropdownPos.width,
                    zIndex: 10000
                }}
            >
                <div className="ds-search-select__dropdown">
                    {/* Search input */}
                    <div className="ds-search-select__search">
                        <Search size={14} className="ds-search-select__search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="ds-search-select__search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options list */}
                    <div className="ds-search-select__options">
                        {filteredOptions.length === 0 ? (
                            <div className="ds-search-select__empty">
                                Sin resultados
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`ds-search-select__option ${String(opt.value) === String(value) ? 'is-selected' : ''}`}
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div
            ref={containerRef}
            className={`ds-search-select ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
        >
            {/* Trigger */}
            <div className="ds-search-select__trigger" onClick={toggleOpen}>
                <span className={`ds-search-select__value ${!selectedLabel ? 'is-placeholder' : ''}`}>
                    {selectedLabel || placeholder}
                </span>
                <div className="ds-search-select__icons">
                    {clearable && value && (
                        <button
                            type="button"
                            className="ds-search-select__clear"
                            onClick={handleClear}
                            tabIndex={-1}
                        >
                            <X size={14} />
                        </button>
                    )}
                    <ChevronDown size={16} className={`ds-search-select__chevron ${isOpen ? 'is-rotated' : ''}`} />
                </div>
            </div>

            {/* Dropdown via Portal */}
            {renderDropdown()}
        </div>
    );
}

export default DSSearchSelect;

