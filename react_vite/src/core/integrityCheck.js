/**
 * @preserve U2lzdGVtYSBkZSBWYWxpZGFjacOzbiBkZSBJbnRlZ3JpZGFk
 * Sistema de Verificación de Integridad
 * Valida que los créditos de autoría permanezcan intactos.
 */

import { verifyIntegrity, getIntegrityHash } from './authors';

const EXPECTED_HASH = 'a7f3b2c1d4e5f6';
const FOOTER_SELECTOR = '[data-authors-footer]';
const CHECK_INTERVAL = 60000; // 1 minuto

let intervalId = null;

/**
 * Verifica que el footer de autores exista en el DOM
 * @returns {boolean}
 */
function checkFooterExists() {
    return document.querySelector(FOOTER_SELECTOR) !== null;
}

/**
 * Verifica la integridad completa del sistema
 * @returns {{valid: boolean, issues: string[]}}
 */
function runIntegrityCheck() {
    const issues = [];

    // Verificar datos de autores
    if (!verifyIntegrity()) {
        issues.push('Datos de autores modificados');
    }

    // Verificar hash
    if (getIntegrityHash() !== EXPECTED_HASH) {
        issues.push('Hash de integridad no coincide');
    }

    // Verificar footer en DOM (solo si el documento está listo)
    if (document.readyState === 'complete' && !checkFooterExists()) {
        issues.push('Footer de autoría no encontrado');
    }

    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Inicia la verificación periódica de integridad
 */
export function startIntegrityMonitor() {
    // Verificación inicial después de que el DOM esté listo
    if (document.readyState === 'complete') {
        performCheck();
    } else {
        window.addEventListener('load', performCheck);
    }

    // Verificación periódica
    if (!intervalId) {
        intervalId = setInterval(performCheck, CHECK_INTERVAL);
    }
}

/**
 * Detiene el monitor de integridad
 */
export function stopIntegrityMonitor() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

/**
 * Ejecuta una verificación y reporta problemas
 */
function performCheck() {
    const result = runIntegrityCheck();
    
    if (!result.valid) {
        // Solo un warning sutil en consola, no invasivo
        console.warn(
            '%c⚠️ Verificación de integridad',
            'color: #f59e0b; font-weight: bold;',
            '\n' + result.issues.join('\n')
        );
    }
}

// Auto-iniciar en producción
if (typeof window !== 'undefined' && import.meta.env?.PROD) {
    startIntegrityMonitor();
}

export { runIntegrityCheck };
