import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { SecurityProvider } from '../core/SecurityContext'
import { Sidebar } from '../components/Sidebar'
import { UserMenu } from '../components/UserMenu'
import { DSFooter } from '../ds-layout/DSFooter'
import { DSFontScaleModal } from '../ds-overlays/DSFontScaleModal'
import { getHeaderConfig } from '../services/menuService'
import { resolvePageEntry } from './PageRegistry'
import { DASHBOARD_ROUTE } from './routes'

function buildPageProps(entry, context) {
  if (!entry || typeof entry.buildProps !== 'function') return {}
  return entry.buildProps(context)
}

function PageFallback() {
  return (
    <div className="app-page-fallback">
      <span className="app-page-fallback__spinner" aria-hidden="true" />
      <span>Cargando módulo...</span>
    </div>
  )
}

export function AppShell({
  activePage,
  onNavigate,
  userData,
  userMenus,
  onLogout,
  theme,
  setTheme,
  availableThemes,
  themeLabels,
  appConfig,
  sessionWarning,
  uiRefreshEnabled,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showFontScaleModal, setShowFontScaleModal] = useState(false)

  const { Icon: HeaderIcon, title: headerTitle } = getHeaderConfig(activePage)
  const pageEntry = useMemo(() => resolvePageEntry(activePage), [activePage])
  const ActivePage = pageEntry ? pageEntry.component : null
  const pageProps = useMemo(
    () =>
      buildPageProps(pageEntry, {
        userData,
        userMenus,
        onNavigate,
      }),
    [pageEntry, userData, userMenus, onNavigate],
  )

  // Redirigir al dashboard si la ruta no tiene entrada registrada
  useEffect(() => {
    if (!pageEntry) {
      onNavigate(DASHBOARD_ROUTE)
    }
  }, [pageEntry, onNavigate])

  // Si no hay página válida, mostrar fallback mientras se redirige
  if (!ActivePage) {
    return <PageFallback />
  }

  return (
    <SecurityProvider user={userData}>
      <div className="app-with-sidebar">
        <Sidebar
          menus={userMenus}
          activePage={activePage}
          onNavigate={onNavigate}
          user={userData}
          onLogout={onLogout}
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((previous) => !previous)}
          appConfig={appConfig}
        />

        <div className={`main-content ${isCollapsed ? 'is-collapsed' : ''} ${uiRefreshEnabled ? 'ui-refresh-v1' : ''}`}>
          <div className="main-content__header">
            <h1
              className="main-content__title main-content__title--clickable"
              title={`${headerTitle} (click para ir al Dashboard)`}
              onClick={() => onNavigate(DASHBOARD_ROUTE)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onNavigate(DASHBOARD_ROUTE)
              }}
            >
              <span>
                <HeaderIcon size={20} />
                <span>{headerTitle}</span>
              </span>
            </h1>
            <div className="main-content__controls">
              <UserMenu
                user={userData}
                theme={theme}
                setTheme={setTheme}
                availableThemes={availableThemes}
                themeLabels={themeLabels}
                onLogout={onLogout}
                onFontScale={() => setShowFontScaleModal(true)}
              />
            </div>
          </div>

          {sessionWarning && sessionWarning <= 5 && (
            <div className="main-content__session-warning">
              <span aria-hidden="true">⏱️</span>
              <span>
                Tu sesión expirará en <strong>{sessionWarning} minuto{sessionWarning !== 1 ? 's' : ''}</strong>. Guarda tu
                trabajo.
              </span>
            </div>
          )}

          <div className="main-content__body">
            <Suspense fallback={<PageFallback />}>
              <ActivePage {...pageProps} />
            </Suspense>
          </div>

          <DSFooter companyName="Company" />
        </div>

        <DSFontScaleModal isOpen={showFontScaleModal} onClose={() => setShowFontScaleModal(false)} />
      </div>
    </SecurityProvider>
  )
}
