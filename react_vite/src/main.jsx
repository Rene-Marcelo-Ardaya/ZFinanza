/**
 * @preserve zG9sZGVycyBieSBSZW5lIE1hcmNlbG8gT3J1w7FvIEFyZGF5YSAmIEp1bmlvciBBZ3VpbGFyIExlYcOxb3M=
 * Punto de entrada principal de la aplicación
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/overlays.css'
import './styles/ds-components.css'
import App from './App.jsx'
import { ThemeProvider } from './theme'
import { DSOverlayProvider } from './ds-overlays'
import { SharedDataProvider } from './core/SharedDataContext'
import { UI_REFRESH_V1_ENABLED } from './app/featureFlags'

// =============================================
// SISTEMA DE CONTROL DE VERSIÓN PARA PWA
// Detecta nuevas versiones y fuerza actualización
// =============================================
const VERSION_KEY = 'app_version';
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // Verificar cada 5 minutos

async function checkForUpdates() {
  try {
    // Fetch con cache-busting para siempre obtener la versión más reciente
    const response = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) return;
    
    const serverVersion = await response.json();
    const localVersion = localStorage.getItem(VERSION_KEY);
    
    // Primera vez: guardar versión sin mostrar popup
    if (!localVersion) {
      localStorage.setItem(VERSION_KEY, serverVersion.version);
      return;
    }
    
    // Si la versión cambió, mostrar popup de actualización
    if (localVersion !== serverVersion.version) {
      showUpdatePrompt(serverVersion.version);
    }
  } catch (error) {
    // Silenciar errores de red (offline, etc.)
    console.debug('Version check failed:', error.message);
  }
}

function showUpdatePrompt(newVersion) {
  // Crear overlay de actualización
  const overlay = document.createElement('div');
  overlay.id = 'update-overlay';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
    ">
      <div style="
        background: white;
        padding: 24px 32px;
        border-radius: 8px;
        text-align: center;
        max-width: 320px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <div style="font-size: 40px; margin-bottom: 12px;">🔄</div>
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #1f2d3d;">
          Nueva versión disponible
        </h2>
        <p style="margin: 0 0 20px; font-size: 14px; color: #5a6a85;">
          Versión ${newVersion}
        </p>
        <button onclick="window.forceUpdate()" style="
          background: #3a6ea5;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        ">
          Actualizar ahora
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Función global para forzar actualización
window.forceUpdate = async function() {
  const serverResponse = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: 'no-store' });
  const serverVersion = await serverResponse.json();
  
  // Guardar nueva versión
  localStorage.setItem(VERSION_KEY, serverVersion.version);
  
  // Limpiar caches del Service Worker
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
  
  // Forzar recarga completa
  window.location.reload(true);
};

// Verificar versión al cargar y periódicamente
checkForUpdates();
setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);

document.documentElement.setAttribute('data-ui-refresh-v1', UI_REFRESH_V1_ENABLED ? '1' : '0')

// =============================================
// RENDER DE LA APLICACIÓN
// =============================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme="blue">
      <DSOverlayProvider>
        <SharedDataProvider>
          <App />
        </SharedDataProvider>
      </DSOverlayProvider>
    </ThemeProvider>
  </StrictMode>,
)


