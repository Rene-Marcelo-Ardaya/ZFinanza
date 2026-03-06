/**
 * Ejemplo de uso del componente DSTabsByRole
 * 
 * Este archivo muestra cómo usar el componente DSTabsByRole para cargar tabs
 * dinámicos controlados por roles en una página.
 */

import React from 'react'
import { DSTabsByRole } from './DSTabsByRole'

// ============================================================================
// EJEMPLO 1: Uso básico con contenido estático
// ============================================================================
export function EjemploBasico() {
    return (
        <DSTabsByRole
            route="/sistemas/configuracion"
            tabContents={{
                '1': <div>Contenido de Proveedores</div>,
                '2': <div>Contenido de Tiendas</div>,
                '3': <div>Contenido de Usuarios</div>,
            }}
        />
    )
}

// ============================================================================
// EJEMPLO 2: Uso con renderContent dinámico
// ============================================================================
export function EjemploRenderContent() {
    const renderContent = (tab) => {
        // tab contiene: { key, label, url, icon, order }
        switch (tab.key) {
            case '1':
                return <ProveedoresTab />
            case '2':
                return <TiendasTab />
            case '3':
                return <UsuariosTab />
            default:
                return <div>Tab no encontrado</div>
        }
    }

    return (
        <DSTabsByRole
            route="/sistemas/configuracion"
            renderContent={renderContent}
        />
    )
}

// ============================================================================
// EJEMPLO 3: Uso con parentMenuId explícito
// ============================================================================
export function EjemploParentIdExplicito() {
    return (
        <DSTabsByRole
            parentMenuId={5} // ID del menú "Configuración"
            tabContents={{
                '1': <ProveedoresTab />,
                '2': <TiendasTab />,
            }}
        />
    )
}

// ============================================================================
// EJEMPLO 4: Uso con callbacks y personalización
// ============================================================================
export function EjemploCompleto() {
    const [activeTab, setActiveTab] = React.useState(null)

    const handleTabChange = (key) => {
        setActiveTab(key)
        console.log('Tab activo:', key)
    }

    const handleTabsLoaded = (tabs) => {
        console.log('Tabs cargados:', tabs)
    }

    return (
        <DSTabsByRole
            route="/sistemas/configuracion"
            variant="pills"
            size="lg"
            defaultActive="1"
            onChange={handleTabChange}
            onTabsLoaded={handleTabsLoaded}
            tabContents={{
                '1': <ProveedoresTab />,
                '2': <TiendasTab />,
                '3': <UsuariosTab />,
            }}
            emptyComponent={
                <div className="text-center py-8">
                    <p>No tienes permisos para ver ninguna pestaña.</p>
                </div>
            }
        />
    )
}

// ============================================================================
// Componentes de ejemplo para tabs
// ============================================================================
function ProveedoresTab() {
    return (
        <div>
            <h2>Proveedores</h2>
            <p>Contenido de la pestaña de proveedores...</p>
        </div>
    )
}

function TiendasTab() {
    return (
        <div>
            <h2>Tiendas</h2>
            <p>Contenido de la pestaña de tiendas...</p>
        </div>
    )
}

function UsuariosTab() {
    return (
        <div>
            <h2>Usuarios</h2>
            <p>Contenido de la pestaña de usuarios...</p>
        </div>
    )
}

// ============================================================================
// EJEMPLO 5: Integración con una página existente
// ============================================================================
export function ConfiguracionPage() {
    return (
        <div className="configuracion-page">
            <h1>Configuración</h1>

            <DSTabsByRole
                route="/sistemas/configuracion"
                renderContent={(tab) => {
                    // Renderizar contenido según el tab activo
                    return (
                        <div className="tab-content">
                            <h2>{tab.label}</h2>
                            <p>URL del tab: {tab.url}</p>
                            {/* Aquí puedes cargar el componente específico para cada tab */}
                        </div>
                    )
                }}
            />
        </div>
    )
}

// ============================================================================
// EJEMPLO 6: Uso con hooks personalizados
// ============================================================================
export function EjemploConHooks() {
    const [activeTab, setActiveTab] = React.useState(null)

    // Cargar datos cuando cambia el tab activo
    React.useEffect(() => {
        if (activeTab) {
            console.log('Cargando datos para tab:', activeTab)
            // Aquí puedes cargar datos específicos para el tab activo
        }
    }, [activeTab])

    return (
        <DSTabsByRole
            route="/sistemas/configuracion"
            onChange={setActiveTab}
            renderContent={(tab) => (
                <div>
                    <p>Tab activo: {tab.label}</p>
                    {/* Contenido dinámico basado en el tab activo */}
                </div>
            )}
        />
    )
}
