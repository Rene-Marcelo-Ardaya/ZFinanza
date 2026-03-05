import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, X, Check } from 'lucide-react';

/**
 * DSMultiSearchSelect - Multi-select con buscador integrado
 *
 * Props:
 * - options: Array de { value, label }
 * - selectedValues: Array de values seleccionados
 * - onChange: Callback (newValues[]) cuando cambia la selección
 * - placeholder: Texto cuando no hay selección
 * - searchPlaceholder: Texto del buscador
 * - disabled: Deshabilitar
 * - label: Label del campo
 * - className: Clase adicional
 */
export function DSMultiSearchSelect({
    options = [],
    selectedValues = [],
    onChange,
    placeholder = 'Seleccionar...',
    searchPlaceholder = 'Buscar...',
    disabled = false,
    label,
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedSet = useMemo(() => {
        return new Set(selectedValues.map((v) => String(v)));
    }, [selectedValues]);

    // Filtrar opciones por búsqueda
    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const query = search.toLowerCase();
        return options.filter((opt) => opt.label.toLowerCase().includes(query));
    }, [options, search]);

    // Labels de los seleccionados (para tags)
    const selectedItems = useMemo(() => {
        return options.filter((opt) => selectedSet.has(String(opt.value)));
    }, [options, selectedSet]);

    // Calcular posición del dropdown
    const updateDropdownPosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                const portal = document.querySelector('.ds-multi-search-select__dropdown-portal');
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

    const handleToggleOption = (opt) => {
        const valStr = String(opt.value);
        let newValues;
        if (selectedSet.has(valStr)) {
            newValues = selectedValues.filter((v) => String(v) !== valStr);
        } else {
            newValues = [...selectedValues, opt.value];
        }
        onChange?.(newValues);
    };

    const handleRemoveTag = (val) => {
        const newValues = selectedValues.filter((v) => String(v) !== String(val));
        onChange?.(newValues);
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        onChange?.([]);
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
                className="ds-multi-search-select__dropdown-portal"
                style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    minWidth: dropdownPos.width,
                    zIndex: 10000,
                }}
            >
                <div className="ds-multi-search-select__dropdown">
                    {/* Search input */}
                    <div className="ds-multi-search-select__search">
                        <Search size={14} className="ds-multi-search-select__search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="ds-multi-search-select__search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options list */}
                    <div className="ds-multi-search-select__options">
                        {filteredOptions.length === 0 ? (
                            <div className="ds-multi-search-select__empty">Sin resultados</div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = selectedSet.has(String(opt.value));
                                return (
                                    <div
                                        key={opt.value}
                                        className={`ds-multi-search-select__option ${isSelected ? 'is-selected' : ''}`}
                                        onClick={() => handleToggleOption(opt)}
                                    >
                                        <span className="ds-multi-search-select__option-check">
                                            {isSelected && <Check size={12} color="#fff" />}
                                        </span>
                                        <span className="ds-multi-search-select__option-label">
                                            {opt.label}
                                        </span>
                                    </div>
                                );
                            })
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
            className={`ds-multi-search-select ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
        >
            {label && <label className="ds-field__label">{label}</label>}

            {/* Trigger */}
            <div className="ds-multi-search-select__trigger" onClick={toggleOpen}>
                {selectedItems.length === 0 ? (
                    <span className="ds-multi-search-select__placeholder">{placeholder}</span>
                ) : (
                    <span className="ds-multi-search-select__count">
                        {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
                    </span>
                )}
                <div className="ds-multi-search-select__icons">
                    {selectedItems.length > 0 && (
                        <button
                            type="button"
                            className="ds-multi-search-select__clear"
                            onClick={handleClearAll}
                            tabIndex={-1}
                        >
                            <X size={14} />
                        </button>
                    )}
                    <ChevronDown
                        size={16}
                        className={`ds-multi-search-select__chevron ${isOpen ? 'is-rotated' : ''}`}
                    />
                </div>
            </div>

            {/* Tags debajo */}
            {selectedItems.length > 0 && (
                <div className="ds-multi-search-select__tags">
                    {selectedItems.map((item) => (
                        <span key={item.value} className="ds-multi-search-select__tag">
                            <span className="ds-multi-search-select__tag-label">{item.label}</span>
                            <button
                                type="button"
                                className="ds-multi-search-select__tag-remove"
                                onClick={() => handleRemoveTag(item.value)}
                                tabIndex={-1}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown via Portal */}
            {renderDropdown()}
        </div>
    );
}

export default DSMultiSearchSelect;
