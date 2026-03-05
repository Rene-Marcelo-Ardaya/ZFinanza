/**
 * UserMenu - Menú de usuario en el header
 * Desktop: dropdown posicionado bajo el avatar
 * Móvil: bottom-sheet que sube desde abajo
 * 
 * Agrupa: info usuario, selector tema, tamaño fuente, cerrar sesión
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogOut, Palette, Type } from 'lucide-react';
import './UserMenu.css';

export function UserMenu({
    user,
    theme,
    setTheme,
    availableThemes,
    themeLabels,
    onLogout,
    onFontScale
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Cerrar al hacer click fuera (desktop)
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Prevenir scroll del body en móvil cuando está abierto
    useEffect(() => {
        if (isOpen && window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleLogout = useCallback(() => {
        setIsOpen(false);
        if (onLogout) onLogout();
    }, [onLogout]);

    const handleFontScale = useCallback(() => {
        setIsOpen(false);
        if (onFontScale) onFontScale();
    }, [onFontScale]);

    // Obtener iniciales del usuario
    const getInitials = () => {
        const name = user?.name || user?.email || 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <div className="user-menu" ref={menuRef}>
            {/* Botón trigger - Avatar */}
            <button
                type="button"
                className="user-menu__trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Menú de usuario"
                title={user?.name || user?.email || 'Usuario'}
            >
                <div className="user-menu__avatar">
                    <span className="user-menu__avatar-text">{getInitials()}</span>
                </div>
            </button>

            {/* Overlay para móvil */}
            <div
                className={`user-menu__overlay ${isOpen ? 'is-visible' : ''}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Dropdown / Bottom-sheet */}
            {isOpen && (
                <div className="user-menu__dropdown" role="menu">
                    {/* Header con info de usuario */}
                    <div className="user-menu__header">
                        <div className="user-menu__header-avatar">
                            {getInitials()}
                        </div>
                        <div className="user-menu__header-info">
                            <div className="user-menu__header-name">
                                {user?.name || user?.email || 'Usuario'}
                            </div>
                            <div className="user-menu__header-role">
                                {user?.role || 'Usuario'}
                            </div>
                        </div>
                    </div>

                    {/* Opciones */}
                    <div className="user-menu__items">
                        {/* Selector de Tema */}
                        <div className="user-menu__item" role="menuitem">
                            <div className="user-menu__item-icon user-menu__item-icon--theme">
                                <Palette size={16} />
                            </div>
                            <div className="user-menu__item-text">
                                <span className="user-menu__item-label">Tema</span>
                            </div>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="user-menu__theme-select"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {availableThemes?.map((t) => (
                                    <option key={t} value={t}>{themeLabels?.[t] || t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tamaño de Texto */}
                        <button
                            type="button"
                            className="user-menu__item"
                            onClick={handleFontScale}
                            role="menuitem"
                        >
                            <div className="user-menu__item-icon user-menu__item-icon--font">
                                <Type size={16} />
                            </div>
                            <div className="user-menu__item-text">
                                <span className="user-menu__item-label">Tamaño de texto</span>
                                <span className="user-menu__item-desc">Ajustar fuente</span>
                            </div>
                        </button>

                        {/* Separador */}
                        <div className="user-menu__divider" role="separator" />

                        {/* Cerrar Sesión */}
                        <button
                            type="button"
                            className="user-menu__item user-menu__item--danger"
                            onClick={handleLogout}
                            role="menuitem"
                        >
                            <div className="user-menu__item-icon">
                                <LogOut size={16} />
                            </div>
                            <div className="user-menu__item-text">
                                <span className="user-menu__item-label">Cerrar Sesión</span>
                                <span className="user-menu__item-desc">Salir de la cuenta</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
