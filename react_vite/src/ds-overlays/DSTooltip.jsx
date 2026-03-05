import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import ReactDOM from 'react-dom';

/**
 * DSTooltip - Tooltip que usa portal para escapar cualquier contenedor
 * Se renderiza directamente en el body, por encima de todo
 */
export function DSTooltip({ text, children, icon = true }) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    useEffect(() => {
        if (visible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const tooltipWidth = 220;

            // Calcular posición: centrado arriba del trigger
            let left = rect.left + rect.width / 2 - tooltipWidth / 2;
            let top = rect.top - 8; // 8px arriba del trigger

            // Ajustar si se sale por la izquierda
            if (left < 10) left = 10;
            // Ajustar si se sale por la derecha
            if (left + tooltipWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltipWidth - 10;
            }

            setPosition({ top, left });
        }
    }, [visible]);

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    const tooltipContent = visible && ReactDOM.createPortal(
        <div
            className="ds-tooltip-portal"
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                transform: 'translateY(-100%)',
                zIndex: 99999,
                pointerEvents: 'none',
            }}
        >
            <div className="ds-tooltip-portal__content">
                {text}
                <div className="ds-tooltip-portal__arrow" />
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <span
                ref={triggerRef}
                className="ds-tooltip-trigger"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {icon ? (children || <HelpCircle size={14} />) : children}
            </span>
            {tooltipContent}
        </>
    );
}
