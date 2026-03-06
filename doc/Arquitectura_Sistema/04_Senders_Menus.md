# Senders de Menús - Guía para IA

Este documento explica cómo crear los "senders" (proveedores de datos) para los menús del sistema, tanto para el **Sidebar** como para los **Tabs**.

---

## 1. Conceptos Fundamentales

### ¿Qué es un "Sender"?

Un **sender** es el componente o servicio responsable de enviar/proveer los datos de menús desde el Backend al Frontend.

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| **Sender de Sidebar** | Envía los menús principales de navegación lateral | Backend: `MenuController::menusPorRol()` |
| **Sender de Tabs** | Envía las pestañas hijas de una página específica | Backend: `MenuController::getTabsByPage()` |

### Tipos de Menú

El sistema distingue dos tipos mediante el campo `menu_type`:
- **`sidebar`**: Menús principales en la barra lateral.
- **`tab`**: Pestañas dentro de una página (hijas de un menú Sidebar).

---

## 2. Sender de Sidebar (Backend - Laravel)

### Ubicación
`api_laravel/app/Http/Controllers/Sistemas/MenuController.php`

### Método: `menusPorRol()`

```php
public function menusPorRol(Request $request)
{
    $user = $request->user();
    
    if (!$user || $user->roles->isEmpty()) {
        return response()->json([
            'success' => true,
            'data' => ['menus' => []]
        ]);
    }

    // Obtener menús de los roles del usuario
    $menuIds = [];
    foreach ($user->roles as $role) {
        $roleMenuIds = $role->menus()->pluck('menus.id')->toArray();
        $menuIds = array_merge($menuIds, $roleMenuIds);
    }
    $menuIds = array_unique($menuIds);

    // Solo menús tipo 'sidebar', activos y ordenados
    $menus = Menu::whereIn('id', $menuIds)
        ->where('is_active', true)
        ->where('menu_type', 'sidebar')
        ->orderBy('order')
        ->get();

    $menuTree = $this->buildMenuTree($menus);

    return response()->json([
        'success' => true,
        'data' => ['menus' => $menuTree]
    ]);
}

private function buildMenuTree($menus, $parentId = null)
{
    $tree = [];
    foreach ($menus as $menu) {
        if ($menu->parent_id == $parentId) {
            $children = $this->buildMenuTree($menus, $menu->id);
            $menuItem = $menu->toArray();
            if ($children) {
                $menuItem['children'] = $children;
            }
            $tree[] = $menuItem;
        }
    }
    return $tree;
}
```

### Ruta
`routes/api/sistemas.php`:
```php
Route::middleware('auth:sanctum')->get('/menus/por-rol', [MenuController::class, 'menusPorRol']);
```

---

## 3. Sender de Tabs (Backend - Laravel)

### Método: `getTabsByPage()`

```php
public function getTabsByPage(Request $request, $parentMenuId)
{
    $user = $request->user();
    
    if (!$user || $user->roles->isEmpty()) {
        return response()->json([
            'success' => true,
            'data' => ['tabs' => []]
        ]);
    }

    // Obtener menús de los roles del usuario
    $menuIds = [];
    foreach ($user->roles as $role) {
        $roleMenuIds = $role->menus()->pluck('menus.id')->toArray();
        $menuIds = array_merge($menuIds, $roleMenuIds);
    }
    $menuIds = array_unique($menuIds);

    // Solo tabs del menú padre, activos y ordenados
    $tabs = Menu::whereIn('id', $menuIds)
        ->where('parent_id', $parentMenuId)
        ->where('menu_type', 'tab')
        ->where('is_active', true)
        ->orderBy('order')
        ->get();

    $formattedTabs = $tabs->map(function ($tab) {
        return [
            'id' => $tab->id,
            'key' => $tab->id,
            'label' => $tab->name,
            'url' => $tab->url,
            'icon' => $tab->icon,
            'order' => $tab->order,
        ];
    });

    return response()->json([
        'success' => true,
        'data' => ['tabs' => $formattedTabs]
    ]);
}
```

### Ruta
`routes/api/sistemas.php`:
```php
Route::middleware('auth:sanctum')->get('/menus/{parentMenuId}/tabs', [MenuController::class, 'getTabsByPage']);
```

---

## 4. Recepción en el Frontend (React)

### 4.1 Sidebar - Recepción en Login

`react_vite/src/services/authService.js`:
```javascript
export async function login(name, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, password }),
    });

    const result = await response.json();

    if (result.success) {
        localStorage.setItem(TOKEN_KEY, result.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify({
            isAuthenticated: true,
            loginTime: new Date().toISOString(),
            ...result.data.user
        }));
        
        // Guardar menús del sidebar
        if (result.data.menus) {
            saveMenu(result.data.menus);
        }
        
        return { success: true, data: userData, menus: result.data.menus };
    }
}
```

### 4.2 Tabs - Servicio Frontend

`react_vite/src/services/menuService.js`:
```javascript
export async function getTabsByPage(parentMenuId) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return [];

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/sistemas/menus/${parentMenuId}/tabs`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const result = await response.json();
        
        if (result.success && result.data && result.data.tabs) {
            return result.data.tabs.map(tab => ({
                key: String(tab.id),
                label: tab.label,
                icon: tab.icon ? getMenuIconComponent(tab.icon) : null,
                url: tab.url,
                order: tab.order
            }));
        }
        
        return [];
    } catch (error) {
        console.error('Error fetching tabs by page:', error);
        return [];
    }
}
```

### 4.3 Componente DSTabsByRole

`react_vite/src/ds-layout/DSTabsByRole.jsx`:
```javascript
export function DSTabsByRole({ route, parentMenuId, renderContent, tabContents = {} }) {
    const [tabs, setTabs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        loadTabs()
    }, [route, parentMenuId])

    const loadTabs = async () => {
        setLoading(true)
        try {
            const menuId = parentMenuId || getParentMenuIdByRoute(route)
            if (!menuId) {
                setTabs([])
                setLoading(false)
                return
            }

            const loadedTabs = await getTabsByPage(menuId)
            setTabs(loadedTabs)
            
            if (loadedTabs.length > 0) {
                setActiveTab(loadedTabs[0]?.key)
            }
        } catch (error) {
            console.error('Error cargando tabs:', error)
            setTabs([])
        } finally {
            setLoading(false)
        }
    }

    const renderActiveTabContent = () => {
        if (!activeTab) return null
        const activeTabData = tabs.find(tab => tab.key === activeTab)
        if (!activeTabData) return null

        if (renderContent) return renderContent(activeTabData)
        if (tabContents[activeTab]) return tabContents[activeTab]
        return null
    }

    return (
        <DSTabs
            tabs={tabs}
            defaultActive={activeTab}
            onChange={setActiveTab}
        >
            {renderActiveTabContent()}
        </DSTabs>
    )
}
```

---

## 5. Crear un Nuevo Sender

### 5.1 Nuevo Sender de Sidebar

1. **Backend** (`MenuController.php`):
```php
public function getCustomSidebar(Request $request)
{
    $user = $request->user();
    // Tu lógica personalizada
    $menus = Menu::where('is_active', true)
        ->where('menu_type', 'sidebar')
        ->orderBy('order')
        ->get();
    
    return response()->json([
        'success' => true,
        'data' => ['menus' => $this->buildMenuTree($menus)]
    ]);
}
```

2. **Ruta** (`routes/api/sistemas.php`):
```php
Route::middleware('auth:sanctum')->get('/menus/custom', [MenuController::class, 'getCustomSidebar']);
```

3. **Frontend** (`menuService.js`):
```javascript
export async function getCustomSidebar() {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/sistemas/menus/custom`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    return result.success && result.data?.menus ? normalizeMenus(result.data.menus) : [];
}
```

### 5.2 Nuevo Sender de Tabs

1. **Backend** (`MenuController.php`):
```php
public function getCustomTabs(Request $request, $parentMenuId)
{
    $tabs = Menu::where('parent_id', $parentMenuId)
        ->where('menu_type', 'tab')
        ->where('is_active', true)
        ->orderBy('order')
        ->get();
    
    $formattedTabs = $tabs->map(fn($tab) => [
        'id' => $tab->id, 'key' => $tab->id, 'label' => $tab->name,
        'url' => $tab->url, 'icon' => $tab->icon, 'order' => $tab->order,
    ]);
    
    return response()->json(['success' => true, 'data' => ['tabs' => $formattedTabs]]);
}
```

2. **Ruta**:
```php
Route::middleware('auth:sanctum')->get('/menus/{parentMenuId}/custom-tabs', [MenuController::class, 'getCustomTabs']);
```

3. **Frontend**:
```javascript
export async function getCustomTabs(parentMenuId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/sistemas/menus/${parentMenuId}/custom-tabs`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    return result.success && result.data?.tabs ? result.data.tabs.map(tab => ({
        key: String(tab.id), label: tab.label,
        icon: tab.icon ? getMenuIconComponent(tab.icon) : null,
        url: tab.url, order: tab.order
    })) : [];
}
```

---

## 6. Buenas Prácticas

### Backend (Laravel)
- ✅ Filtrar por roles del usuario
- ✅ Filtrar por `menu_type` ('sidebar' o 'tab')
- ✅ Verificar autenticación (`$request->user()`)
- ✅ Retornar `{ success: true, data: { ... } }`
- ✅ Ordenar por `order`
- ❌ No enviar menús inactivos
- ❌ No mezclar tipos en mismo endpoint

### Frontend (React)
- ✅ Enviar token en header `Authorization`
- ✅ Manejar errores con try/catch
- ✅ Retornar array vacío en caso de error
- ✅ Usar `getMenuIconComponent()` para íconos
- ❌ No asumir respuesta siempre tiene datos
- ❌ No llamar endpoint sin token

---

## 7. Referencias

- **Backend**: `api_laravel/app/Http/Controllers/Sistemas/MenuController.php`
- **Frontend Service**: `react_vite/src/services/menuService.js`
- **Frontend Auth**: `react_vite/src/services/authService.js`
- **Componente Tabs**: `react_vite/src/ds-layout/DSTabsByRole.jsx`
