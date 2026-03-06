import React, { useState, useEffect } from 'react'
import { DSTabs } from './DSTabs'
import { getTabsByPage, getParentMenuIdByRoute } from '../services/menuService'
import { DSLoading } from '../ds-overlays/DSLoading'

/**
 * Componente de Tabs dinámicos controlados por roles
 * 
 * Este componente carga tabs dinámicamente desde el backend según el rol del usuario.
 * Los tabs son hijos de un menú principal (página) y se filtran por permisos.
 * 
 * @param {Object} props
 * @param {string} props.route - Ruta de la página actual (ej: '/sistemas/configuracion')
 * @param {string|number} props.parentMenuId - ID del menú padre (opcional, se puede inferir de la ruta)
 * @param {Function} props.renderTabContent - Función que recibe el tab actual y retorna el contenido
 * @param {string} props.variant - Variante visual: 'default', 'pills', 'underline'
 * @param {string} props.size - Tamaño: 'sm', 'md', 'lg'
 * @param {string|number} props.defaultActive - Tab activa por defecto (key del tab)
 * @param {Function} props.onChange - Callback cuando se cambia de tab (recibe la key)
 * @param {Function} props.onTabsLoaded - Callback cuando se cargan los tabs (recibe el array de tabs)
 * @param {React.ReactNode} props.loadingComponent - Componente de carga personalizado
 * @param {React.ReactNode} props.emptyComponent - Componente cuando no hay tabs
 * @param {Object} props.tabContents - Objeto con el contenido de cada tab (key -> ReactNode)
 * @param {Function} props.renderContent - Función alternativa para renderizar contenido (recibe tab activo)
 */
export function DSTabsByRole({
    route,
    parentMenuId,
    renderTabContent,
    variant = 'underline',
    size = 'md',
    defaultActive,
    onChange,
    onTabsLoaded,
    loadingComponent,
    emptyComponent,
    tabContents = {},
    renderContent,
    ...rest
}) {
    const [tabs, setTabs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        loadTabs()
    }, [route, parentMenuId])

    const loadTabs = async () => {
        setLoading(true)
        try {
            // Determinar el ID del menú padre
            const menuId = parentMenuId || getParentMenuIdByRoute(route)

            if (!menuId) {
                console.warn('No se pudo determinar el ID del menú padre para la ruta:', route)
                setTabs([])
                setLoading(false)
                return
            }

            // Cargar tabs desde el backend
            const loadedTabs = await getTabsByPage(menuId)
            setTabs(loadedTabs)

            // Notificar que los tabs fueron cargados
            if (onTabsLoaded) {
                onTabsLoaded(loadedTabs)
            }

            // Establecer el tab activo por defecto
            if (loadedTabs.length > 0) {
                const initialTab = defaultActive || loadedTabs[0]?.key
                setActiveTab(initialTab)
            }
        } catch (error) {
            console.error('Error cargando tabs:', error)
            setTabs([])
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (key) => {
        setActiveTab(key)
        if (onChange) {
            onChange(key)
        }
    }

    // Renderizar contenido del tab activo
    const renderActiveTabContent = () => {
        if (!activeTab) return null

        const activeTabData = tabs.find(tab => tab.key === activeTab)
        if (!activeTabData) return null

        // Prioridad 1: Usar renderContent si está proporcionado
        if (renderContent) {
            return renderContent(activeTabData)
        }

        // Prioridad 2: Usar tabContents si está proporcionado
        if (tabContents && tabContents[activeTab]) {
            return tabContents[activeTab]
        }

        // Prioridad 3: Usar renderTabContent si está proporcionado
        if (renderTabContent) {
            return renderTabContent(activeTabData)
        }

        return null
    }

    // Estado de carga
    if (loading) {
        return loadingComponent || <DSLoading message="Cargando pestañas..." />
    }

    // No hay tabs disponibles
    if (tabs.length === 0) {
        if (emptyComponent) {
            return emptyComponent
        }
        return (
            <div className="ds-tabs-by-role__empty">
                <p>No hay pestañas disponibles para esta página.</p>
            </div>
        )
    }

    // Preparar tabs para DSTabs
    const tabsWithContent = tabs.map(tab => ({
        ...tab,
        content: renderTabContent ? renderTabContent(tab) : tabContents[tab.key]
    }))

    return (
        <DSTabs
            tabs={tabsWithContent}
            defaultActive={defaultActive}
            onChange={handleTabChange}
            variant={variant}
            size={size}
            {...rest}
        />
    )
}

export default DSTabsByRole
