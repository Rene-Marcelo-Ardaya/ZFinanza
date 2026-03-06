/**
 * @preserve zG9sZGVycyBieSBSZW5lIE1hcmNlbG8gT3J1w7FvIEFyZGF5YSAmIEp1bmlvciBBZ3VpbGFyIExlYcOxb3M=
 * SecuredButton - Button with optional security control
 *
 * This component allows assigning multiple security groups to a button.
 * The button will be visible if the user has access to ANY of the specified groups (OR logic).
 *
 * @param {string|string[]} securityId - Single security ID or array of security IDs
 * @param {string} securityPage - Page identifier for security context
 * @param {string} securityDesc - Description for security configuration
 * @param {boolean} showConfigButton - Show configuration button
 * @param {ReactNode} children - Button content
 * @param {boolean} disabled - Disable the button
 */
import React, { useState } from 'react';
import { DSButton } from './DSButton';
import { useSecurity } from '../core/SecurityContext';
import './SecuredButton.css';

export function SecuredButton({
    securityId,
    securityPage,
    securityDesc,
    showConfigButton = true,
    children,
    disabled = false,
    ...buttonProps
}) {
    const [showConfig, setShowConfig] = useState(false);
    const { hasPermission } = useSecurity();
    const buttonClassName = buttonProps.className || '';

    // Normalizar securityId a array
    const securityIds = Array.isArray(securityId) ? securityId : (securityId ? [securityId] : []);

    // Si no tiene securityId, actúa como botón normal
    if (securityIds.length === 0) {
        return <DSButton {...buttonProps} disabled={disabled}>{children}</DSButton>;
    }

    // Verificar si el usuario tiene acceso a ALGUNO de los grupos especificados (OR logic)
    const hasAccess = securityIds.some(id => hasPermission(id));

    // Si no tiene acceso, no renderizar nada
    if (!hasAccess) {
        return null;
    }

    // Mostrar el botón si tiene acceso
    return (
        <div className="secured-button-wrapper">
            <DSButton {...buttonProps} disabled={disabled}>
                {children}
            </DSButton>
        </div>
    );
}
