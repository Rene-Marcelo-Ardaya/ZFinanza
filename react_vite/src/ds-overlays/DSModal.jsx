import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

/**
 * useMobileDetection - Hook interno para detectar dispositivos móviles
 */
function useMobileDetection(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                || window.innerWidth <= breakpoint
            setIsMobile(mobile)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [breakpoint])

    return isMobile
}

/**
 * DSModal - Componente de modal/diálogo
 * 
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.icon - Icono del título
 * @param {React.ReactNode} props.children - Contenido del body
 * @param {React.ReactNode} props.footer - Contenido del footer (desktop)
 * @param {React.ReactNode} props.mobileFooter - Contenido del footer móvil (opcional)
 * @param {'sm'|'md'|'lg'|'xl'|'full'} props.size - Tamaño del modal
 * @param {boolean} props.closeOnOverlay - Si se cierra al clickear el overlay (default: false)
 * @param {boolean} props.closeOnDoubleClick - Si se cierra con doble click en overlay (default: true)
 * @param {boolean} props.closeOnEsc - Si se cierra con Escape
 * @param {'default'|'flush'|'white'} props.bodyStyle - Estilo del body
 * @param {'left'|'center'|'right'|'space-between'} props.footerAlign
 * @param {number} props.mobileBreakpoint - Breakpoint para modo móvil/táctil (default: 768)
 * @param {string} props.className
 */
export function DSModal({
    isOpen,
    onClose,
    title,
    icon,
    children,
    footer,
    mobileFooter,
    size = 'md',
    closeOnOverlay = false,
    closeOnDoubleClick = true,
    closeOnEsc = true,
    bodyStyle = 'default',
    footerAlign = 'right',
    mobileBreakpoint = 768,
    className = '',
}) {
    const [visible, setVisible] = useState(false)
    const isMobile = useMobileDetection(mobileBreakpoint)

    useEffect(() => {
        if (isOpen) {
            // Pequeño delay para la animación
            requestAnimationFrame(() => setVisible(true))
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden'
        } else {
            setVisible(false)
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    useEffect(() => {
        if (!closeOnEsc || !isOpen) return

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose?.()
            }
        }

        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [closeOnEsc, isOpen, onClose])

    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose?.()
        }
    }

    const handleOverlayDoubleClick = (e) => {
        if (closeOnDoubleClick && e.target === e.currentTarget) {
            onClose?.()
        }
    }

    const overlayClasses = [
        'ds-modal-overlay',
        visible && 'ds-modal-overlay--visible',
    ]
        .filter(Boolean)
        .join(' ')

    const modalClasses = [
        'ds-modal',
        size !== 'md' && `ds-modal--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const footerClasses = [
        'ds-modal__footer',
        footerAlign !== 'right' && `ds-modal__footer--${footerAlign}`,
    ]
        .filter(Boolean)
        .join(' ')

    // Determinar si mostrar footer desktop o móvil
    const shouldShowDesktopFooter = footer && !(isMobile && mobileFooter)
    const shouldShowMobileFooter = isMobile && mobileFooter

    const bodyClasses = [
        'ds-modal__body',
        bodyStyle !== 'default' && `ds-modal__body--${bodyStyle}`,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={overlayClasses} onClick={handleOverlayClick} onDoubleClick={handleOverlayDoubleClick}>
            <div className={modalClasses} role="dialog" aria-modal="true">
                <div className="ds-modal__header">
                    <h3 className="ds-modal__title">
                        {icon}
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="ds-modal__close"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className={bodyClasses}>{children}</div>
                {shouldShowDesktopFooter && <div className={footerClasses}>{footer}</div>}
                {/* Footer móvil dentro del flex layout del modal */}
                {shouldShowMobileFooter && mobileFooter}
            </div>
        </div>
    )
}

/**
 * DSModalSection - Sección dentro del modal
 */
export function DSModalSection({ title, icon, help, children, className = '' }) {
    return (
        <div className={`ds-modal-section ${className}`}>
            {title && (
                <h4 className="ds-modal-section__title">
                    {icon}
                    {title}
                </h4>
            )}
            {help && <div className="ds-modal-section__help">{help}</div>}
            {children}
        </div>
    )
}

/**
 * DSModalGrid - Grid layout dentro del modal
 */
export function DSModalGrid({ children, columns = 2, className = '' }) {
    const classes = [
        'ds-modal-grid',
        columns === 3 && 'ds-modal-grid--3',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return <div className={classes}>{children}</div>
}
