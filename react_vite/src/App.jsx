/**
 * @preserve zG9sZGVycyBieSBSZW5lIE1hcmNlbG8gT3J1w7FvIEFyZGF5YSAmIEp1bmlvciBBZ3VpbGFyIExlYcOxb3M=
 * Base Application Shell
 * 
 * This is a stub for the base React project.
 * Customize this file for your specific application needs.
 */
import React, { useState, useEffect } from 'react'
import './App.css'
import './styles/pages.css'
import { useTheme } from './theme'
import { LoginPage } from './pages/LoginPage'
import { AppShell } from './app/AppShell'
import { getSession } from './services/authService'
import { getStoredMenu, staticMenus } from './services/menuService'
import { getSafeRoute } from './app/routes'

const ACTIVE_PAGE_STORAGE_KEY = 'base:lastActivePage'

function getStoredActivePage() {
  try {
    return getSafeRoute(localStorage.getItem(ACTIVE_PAGE_STORAGE_KEY))
  } catch {
    return getSafeRoute(null)
  }
}

function getInitialSessionData() {
  const session = getSession()

  if (!session?.isAuthenticated) {
    return {
      isAuthed: false,
      userData: null,
      userMenus: staticMenus,
      activePage: getSafeRoute(null),
    }
  }

  return {
    isAuthed: true,
    userData: session,
    userMenus: getStoredMenu() || staticMenus,
    activePage: getStoredActivePage(),
  }
}

function App() {
  const [sessionData, setSessionData] = useState(getInitialSessionData)
  const { theme, setTheme, availableThemes, themeLabels } = useTheme()

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleLogin = (userData) => {
    setSessionData({
      isAuthed: true,
      userData,
      userMenus: getStoredMenu() || staticMenus,
      activePage: getSafeRoute(null),
    })
  }

  const handleLogout = () => {
    localStorage.removeItem(ACTIVE_PAGE_STORAGE_KEY)
    setSessionData({
      isAuthed: false,
      userData: null,
      userMenus: staticMenus,
      activePage: getSafeRoute(null),
    })
  }

  const handlePageChange = (page) => {
    setSessionData(prev => ({ ...prev, activePage: page }))
    localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, page)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  if (!sessionData.isAuthed) {
    return <LoginPage onLoginSuccess={handleLogin} />
  }

  return (
    <AppShell
      userData={sessionData.userData}
      userMenus={sessionData.userMenus}
      activePage={sessionData.activePage}
      onNavigate={handlePageChange}
      onLogout={handleLogout}
      setTheme={handleThemeChange}
      availableThemes={availableThemes}
      themeLabels={themeLabels}
      appConfig={{}}
      sessionWarning={null}
      uiRefreshEnabled={false}
    />
  )
}

export default App
