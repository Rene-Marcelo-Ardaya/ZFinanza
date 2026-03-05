# React + Vite Base Project

A clean, reusable React + Vite base project with a complete Design System, ready for rapid application development.

## 🚀 Features

- ✅ **React 19** - Latest React with modern hooks and features
- ✅ **Vite 7** - Lightning-fast build tool and dev server
- ✅ **PWA Support** - Progressive Web App ready with service workers
- ✅ **Complete Design System** - 60+ reusable components
- ✅ **20 Pre-configured Themes** - Beautiful, production-ready themes
- ✅ **Authentication Flow** - Ready-to-use login/logout infrastructure
- ✅ **Routing System** - React Router setup with page registry
- ✅ **IndexedDB** - Offline-first database with Dexie.js
- ✅ **API Services** - Axios-based API client with interceptors
- ✅ **Theme System** - Dynamic theme switching with CSS variables
- ✅ **Responsive Design** - Mobile-first approach with breakpoints

## 📦 What's Included

### Design System Components

#### Forms (`ds-forms/`)
- DSButton, DSTextField, DSPasswordField
- DSCheckbox, DSRadio, DSRadioGroup
- DSComboBox, DSSearchSelect, DSMultiSearchSelect
- DSDateField, DSTimeField, DSDateTimeField, DSTimeRangeField
- DSTextArea, DSNumberField, DSImageUpload
- DSFormPanel, SecuredButton

#### Layouts (`ds-layout/`)
- DSPage, DSPanel, DSSection
- DSAccordion, DSTabs
- DSBorderLayout, DSFooter

#### Lists (`ds-lists/`)
- DSTable, DSGrid, DSList
- DSBadge, DSEditableGrid

#### Navigation (`ds-navigation/`)
- DSMenuBar, DSTree

#### Overlays (`ds-overlays/`)
- DSModal, DSDialog, DSAlert
- DSMessageBox, DSTooltip
- DSLoading, DSLoadingMask
- DSWindow, DSOverlayContext
- DSMobileNav, DSFontScaleModal, DSBulkImportModal

### Core Infrastructure

- **App Shell** - Main application layout with sidebar and navigation
- **Authentication** - Login/logout flow with token management
- **Theme Provider** - Dynamic theme switching
- **Page Registry** - Centralized page management
- **Route System** - Safe routing with validation
- **Security Context** - User permissions and roles
- **Shared Data Context** - Global state management
- **Toast Notifications** - User feedback system
- **IndexedDB** - Offline storage with Dexie.js

### Available Themes

1. agriZen
2. blue
3. blueprintDraft
4. carbonFiber
5. cyberLogistics
6. dark
7. earth
8. financeExecutive
9. gray
10. kaizen (default)
11. materialDeep
12. midnight
13. nordicMinimal
14. oceanicFlow
15. olive
16. paperStack
17. purple
18. rose
19. solarFlare
20. teal

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone or copy this project to your desired location
cp -r Base/react_vite /path/to/your-project/

# Navigate to the project
cd /path/to/your-project

# Install dependencies
npm install
# or
bun install
```

### Configuration

```bash
# Copy environment example
cp .env.example .env.local

# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build for production
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview production build
npm run preview
# or
bun run preview
```

## 📁 Project Structure

```
Base/react_vite/
├── public/                 # Static assets
│   ├── .htaccess          # Apache SPA configuration
│   ├── logo.png           # Main logo
│   ├── logo_192x192.png  # PWA icon
│   ├── logo_512x512.png  # PWA icon
│   └── version.json      # Version tracking
├── src/
│   ├── app/              # Application infrastructure
│   │   ├── AppShell.jsx
│   │   ├── featureFlags.js
│   │   ├── PageRegistry.js
│   │   └── routes.js
│   ├── components/       # Base components
│   │   ├── common/
│   │   │   └── BrandLogo.jsx
│   │   ├── Sidebar.jsx
│   │   └── UserMenu.jsx
│   ├── core/            # Core utilities
│   │   ├── SecurityContext.jsx
│   │   ├── SharedDataContext.jsx
│   │   ├── useStore.js
│   │   └── useToast.js
│   ├── db/              # IndexedDB setup
│   │   └── db.js
│   ├── ds-*/            # Design System components
│   │   ├── ds-components/
│   │   ├── ds-forms/
│   │   ├── ds-layout/
│   │   ├── ds-lists/
│   │   ├── ds-navigation/
│   │   └── ds-overlays/
│   ├── hooks/           # Custom React hooks
│   │   ├── useMobileDetection.js
│   │   ├── useNetworkStatus.js
│   │   ├── usePWAInstall.js
│   │   └── useSessionTimeout.js
│   ├── pages/           # Page components
│   │   └── LoginPage.jsx
│   ├── services/        # API services
│   │   ├── authService.js
│   │   ├── menuService.js
│   │   ├── settingService.js
│   │   └── index.js
│   ├── styles/          # Global styles
│   ├── theme/           # Theme system
│   │   ├── index.js
│   │   └── tokens/      # Theme tokens (20 themes)
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js     # Vite configuration
└── README.md          # This file
```

## 🔧 Configuration

### Environment Variables

Edit `.env.local` to configure your application:

```bash
# API Configuration
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8000
VITE_API_PROXY_REWRITE_BASE=/api

# Application Configuration
VITE_APP_NAME=My App
VITE_APP_SHORT_NAME=MyApp
VITE_APP_DESCRIPTION=My Application Description

# Base Path Configuration
VITE_BASE_PATH=/

# Theme Configuration
VITE_DEFAULT_THEME=kaizen

# Feature Flags
VITE_UI_REFRESH_V1=1
```

### Vite Configuration

The `vite.config.js` file contains:

- **Path aliases** - Import shortcuts for `ds-components` and `services`
- **PWA configuration** - Service worker and manifest settings
- **API proxy** - Development proxy to avoid CORS issues
- **Build optimization** - Production build settings

## 🎨 Using the Design System

### Importing Components

```jsx
import { DSButton, DSTextField, DSModal } from 'ds-forms'
import { DSPage, DSPanel } from 'ds-layout'
import { DSTable } from 'ds-lists'
```

### Using Themes

```jsx
import { useTheme } from './theme'

function MyComponent() {
  const { theme, setTheme, availableThemes } = useTheme()
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {availableThemes.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  )
}
```

### Using API Services

```jsx
import { login, logout, getSession } from './services/authService'

// Login
const result = await login(username, password)

// Get current session
const session = getSession()

// Logout
logout()
```

## 📝 Adding New Pages

1. Create your page component in `src/pages/`:

```jsx
// src/pages/MyPage.jsx
import React from 'react'
import { DSPage } from 'ds-layout'

export function MyPage() {
  return (
    <DSPage title="My Page">
      <p>Welcome to my page!</p>
    </DSPage>
  )
}
```

2. Register the page in `src/app/PageRegistry.js`:

```js
import { MyPage } from '../pages/MyPage'

export const pages = {
  // ... existing pages
  myPage: {
    path: '/my-page',
    component: MyPage,
    title: 'My Page',
    icon: 'home'
  }
}
```

3. Add the route in `src/app/routes.js`:

```js
export const routes = {
  // ... existing routes
  myPage: '/my-page'
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Apache

1. Upload the contents of `dist/` to your server
2. Ensure `.htaccess` is present for SPA routing
3. Configure your API proxy if needed

### Deploy to Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📚 Additional Resources

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Dexie.js Documentation](https://dexie.org/)
- [Vite PWA Plugin](https://vite-plugin-pwa.netlify.app/)

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 👥 Authors

- Rene Marcelo Oruño Ardaya - [LinkedIn](https://www.linkedin.com/in/rene-marcelo-ardaya/)
- Junior Aguilar Leaños

---

**Built with ❤️ using React + Vite**
