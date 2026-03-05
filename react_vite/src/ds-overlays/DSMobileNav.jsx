import React from 'react'
import { DSSpinner } from './DSLoading'
import './DSMobileNav.css'

/**
 * DSMobileNav - Componente de navegación móvil para modales
 * 
 * Proporciona una barra de navegación fija en la parte inferior de la pantalla
 * optimizada para dispositivos móviles con botones personalizables.
 * 
 * @param {Array<Object>} props.buttons - Array de botones a mostrar
 * @param {boolean} props.saving - Estado de carga global (deshabilita todos los botones)
 * @param {boolean} props.disabled - Deshabilitar todos los botones
 * 
 * @example
 * <DSMobileNav
 *   buttons={[
 *     {
 *       type: 'primary',
 *       icon: <CheckCircle2 size={26} />,
 *       label: 'Guardar',
 *       onClick: () => console.log('Guardar'),
 *       disabled: false,
 *       loading: false
 *     }
 *   ]}
 *   saving={false}
 *   disabled={false}
 * />
 */
export function DSMobileNav({
    buttons = [],
    saving = false,
    disabled = false
}) {
    // Filtrar botones que no están ocultos
    const visibleButtons = buttons.filter(btn => btn.visible !== false)

    if (visibleButtons.length === 0) {
        return null
    }

    return (
        <div className="dsmobile-nav">
            {visibleButtons.map((btn, index) => {
                // Determinar si el botón está deshabilitado
                const isDisabled = btn.disabled || disabled || saving

                // Determinar la clase de variante
                const variantClass = isDisabled ? 'dsmobile-nav__btn--disabled' : `dsmobile-nav__btn--${btn.type || 'secondary'}`

                return (
                    <button
                        key={index}
                        className={`dsmobile-nav__btn ${variantClass}`}
                        onClick={btn.onClick}
                        disabled={isDisabled}
                        type="button"
                    >
                        {/* Icono */}
                        {btn.icon && <btn.icon size={btn.iconSize || 26} />}

                        {/* Texto */}
                        <span>{btn.label}</span>

                        {/* Spinner de carga individual */}
                        {btn.loading && !saving && (
                            <div className="dsmobile-nav__spinner" />
                        )}

                        {/* Spinner de carga global */}
                        {saving && index === visibleButtons.length - 1 && (
                            <div className="dsmobile-nav__spinner" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}

/**
 * DSMobileNavButton - Tipo de botón para DSMobileNav
 * 
 * @typedef {Object} DSMobileNavButton
 * @property {'primary'|'secondary'|'danger'|'success'} type - Tipo de botón
 * @property {React.ReactNode} icon - Icono del botón (componente de lucide-react)
 * @property {string} label - Texto del botón
 * @property {Function} onClick - Callback al hacer clic
 * @property {boolean} [disabled] - Deshabilitar botón individual
 * @property {boolean} [loading] - Mostrar spinner en este botón
 * @property {boolean} [visible] - Mostrar/ocultar botón (default: true)
 * @property {number} [iconSize] - Tamaño del icono (default: 26)
 */
