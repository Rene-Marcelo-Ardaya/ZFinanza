import { useState, useEffect } from 'react'

/**
 * useMobileDetection - Hook para detectar si el dispositivo es móvil
 * 
 * Detecta dispositivos móviles basándose en:
 * - UserAgent (Android, iOS, etc.)
 * - Ancho de pantalla (< 768px)
 * - Soporte para eventos de resize
 * 
 * @returns {boolean} true si es dispositivo móvil, false en caso contrario
 * 
 * @example
 * const isMobile = useMobileDetection();
 * 
 * if (isMobile) {
 *   // Renderizar UI móvil
 * } else {
 *   // Renderizar UI desktop
 * }
 */
export function useMobileDetection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            // Detectar por UserAgent
            const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
            
            // Detectar por ancho de pantalla
            const screenWidthMobile = window.innerWidth < 768
            
            // Es móvil si cumple cualquiera de las dos condiciones
            setIsMobile(userAgentMobile || screenWidthMobile)
        }

        // Verificar al montar
        checkMobile()

        // Escuchar cambios de tamaño de pantalla
        window.addEventListener('resize', checkMobile)

        // Limpiar listener al desmontar
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile
}
