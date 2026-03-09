# ZFinanza - Skill Módulo RRHH

## Contexto

Este skill está especializado en trabajar con el módulo de Recursos Humanos (RRHH) del proyecto ZFinanza. El módulo RRHH abarca la gestión de personal, cargos, y control de asistencia.

## Estructura del Módulo RRHH

### Backend (API Laravel)

```
api_laravel/
├── app/
│   ├── Http/Controllers/RRHH/
│   │   ├── CargoController.php       # Controlador de Cargos
│   │   └── PersonalController.php    # Controlador de Personal
│   └── Models/RRHH/
│       ├── Cargo.php                 # Modelo Cargo
│       ├── Personal.php              # Modelo Personal
│       └── PersonalPinAcceso.php     # Modelo PIN de acceso
└── routes/api/
    └── rrhh.php                      # Rutas RRHH
```

### Frontend (React)

```
react_vite/src/pages/rrhh/
├── Cargos/                           # Gestión de Cargos
│   ├── CargosPage.jsx               # Página principal de Cargos
│   ├── CargosPage.css
│   ├── components/
│   │   ├── CargoCard.jsx            # Tarjeta de Cargo
│   │   ├── CargoFormModal.jsx       # Modal de formulario Cargo
│   │   ├── CargosFilters.jsx        # Filtros de búsqueda
│   │   ├── CargosTable.jsx          # Tabla de Cargos
│   │   └── PersonalPorCargoModal.jsx # Modal de personal por cargo
│   └── hooks/
│       └── useCargos.js             # Hook personalizado de Cargos
└── Personal/                         # Gestión de Personal
    ├── PersonalPage.jsx             # Página principal de Personal
    ├── PersonalPage.css
    ├── components/
    │   ├── PersonalCard.jsx         # Tarjeta de Personal
    │   ├── PersonalFormModal.jsx    # Modal de formulario Personal
    │   ├── PersonalFilters.jsx      # Filtros de búsqueda
    │   └── PersonalTable.jsx        # Tabla de Personal
    └── hooks/
        └── usePersonal.js          # Hook personalizado de Personal
```

### Servicios API

```
react_vite/src/services/
├── personalService.js               # Servicio de Personal
└── cargoService.js                  # Servicio de Cargos
```

## Rutas API RRHH

### Rutas de Personal (`/api/rrhh/personal`)
- `GET /api/rrhh/personal` - Listar personal (con filtros)
- `GET /api/rrhh/personal/{id}` - Obtener un personal
- `POST /api/rrhh/personal` - Crear personal
- `PUT /api/rrhh/personal/{id}` - Actualizar personal
- `DELETE /api/rrhh/personal/{id}` - Eliminar personal (soft delete)

### Rutas de Cargos (`/api/rrhh/cargos`)
- `GET /api/rrhh/cargos` - Listar cargos
- `GET /api/rrhh/cargos/{id}` - Obtener un cargo
- `POST /api/rrhh/cargos` - Crear cargo
- `PUT /api/rrhh/cargos/{id}` - Actualizar cargo
- `DELETE /api/rrhh/cargos/{id}` - Eliminar cargo (soft delete)

## Modelos de Datos

### Personal
```javascript
{
  id: number,
  nombre: string,
  apellido: string,
  ci: string,                    // Carnet de Identidad
  email: string,
  telefono: string,
  direccion: string,
  cargo_id: number,              // FK a Cargo
  fecha_ingreso: string (date),
  fecha_nacimiento: string (date),
  activo: boolean,
  usuario_id: number,            // FK a User (opcional)
  created_at: string,
  updated_at: string
}
```

### Cargo
```javascript
{
  id: number,
  nombre: string,
  descripcion: string,
  nivel: number,                 // Nivel jerárquico
  activo: boolean,
  created_at: string,
  updated_at: string
}
```

### PersonalPinAcceso
```javascript
{
  id: number,
  personal_id: number,           // FK a Personal
  pin: string,                   // PIN de acceso
  activo: boolean,
  created_at: string,
  updated_at: string
}
```

## Relaciones

### Personal
- Pertenece a un Cargo (`cargo_id`)
- Puede tener un Usuario asociado (`usuario_id`)
- Tiene muchos PersonalPinAcceso

### Cargo
- Tiene muchos Personal

## Hooks Personalizados

### usePersonal
Hook para gestionar la lógica de la página de Personal.

```javascript
const {
  personal,           // Lista de personal
  loading,            // Estado de carga
  error,              // Error
  filters,            // Filtros actuales
  pagination,         // Paginación
  fetchPersonal,      // Función para obtener personal
  createPersonal,     // Función para crear personal
  updatePersonal,     // Función para actualizar personal
  deletePersonal,     // Función para eliminar personal
  setFilters          // Función para establecer filtros
} = usePersonal();
```

### useCargos
Hook para gestionar la lógica de la página de Cargos.

```javascript
const {
  cargos,             // Lista de cargos
  loading,            // Estado de carga
  error,              // Error
  fetchCargos,        // Función para obtener cargos
  createCargo,        // Función para crear cargo
  updateCargo,        // Función para actualizar cargo
  deleteCargo         // Función para eliminar cargo
} = useCargos();
```

## Componentes

### PersonalPage
Página principal de gestión de Personal.

**Componentes hijos:**
- `PersonalCard` - Tarjeta con información resumida de personal
- `PersonalTable` - Tabla con lista de personal
- `PersonalFilters` - Filtros de búsqueda
- `PersonalFormModal` - Modal para crear/editar personal

### CargosPage
Página principal de gestión de Cargos.

**Componentes hijos:**
- `CargoCard` - Tarjeta con información del cargo
- `CargosTable` - Tabla con lista de cargos
- `CargosFilters` - Filtros de búsqueda
- `CargoFormModal` - Modal para crear/editar cargo
- `PersonalPorCargoModal` - Modal para ver personal por cargo

## Filtros Comunes

### Filtros de Personal
- Nombre
- Apellido
- CI
- Cargo
- Estado (activo/inactivo)

### Filtros de Cargos
- Nombre
- Nivel
- Estado (activo/inactivo)

## Funcionalidades

### Gestión de Personal
- Listado de personal con paginación
- Búsqueda y filtros
- Creación de nuevo personal
- Edición de personal existente
- Eliminación de personal (soft delete)
- Asignación de cargo
- Asignación de usuario del sistema

### Gestión de Cargos
- Listado de cargos
- Creación de nuevos cargos
- Edición de cargos existentes
- Eliminación de cargos (soft delete)
- Visualización de personal por cargo
- Gestión de niveles jerárquicos

## Patrones de Código

### Estructura de Página RRHH

```javascript
import React from 'react';
import { DSPage, DSTable, DSButton } from '../../ds-layout';
import { usePersonal } from './hooks/usePersonal';
import PersonalFormModal from './components/PersonalFormModal';
import PersonalFilters from './components/PersonalFilters';

const PersonalPage = () => {
  const {
    personal,
    loading,
    error,
    filters,
    fetchPersonal,
    createPersonal,
    updatePersonal,
    deletePersonal,
    setFilters
  } = usePersonal();

  const [showModal, setShowModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar este personal?')) {
      await deletePersonal(id);
      fetchPersonal(filters);
    }
  };

  const handleSave = async (data) => {
    if (editingItem) {
      await updatePersonal(editingItem.id, data);
    } else {
      await createPersonal(data);
    }
    setShowModal(false);
    fetchPersonal(filters);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DSPage title="Gestión de Personal">
      <PersonalFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearch={() => fetchPersonal(filters)}
      />
      <DSButton onClick={handleCreate}>Nuevo Personal</DSButton>
      <PersonalTable
        data={personal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showModal && (
        <PersonalFormModal
          item={editingItem}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </DSPage>
  );
};

export default PersonalPage;
```

## Validaciones

### Validaciones de Personal
- Nombre: requerido, máximo 255 caracteres
- Apellido: requerido, máximo 255 caracteres
- CI: requerido, único
- Email: formato válido, único
- Cargo: requerido
- Fecha de ingreso: requerida, no futura

### Validaciones de Cargo
- Nombre: requerido, máximo 255 caracteres, único
- Descripción: opcional, máximo 500 caracteres
- Nivel: requerido, número positivo

## Consideraciones Especiales

1. **Soft Delete**: Tanto Personal como Cargos usan soft delete
2. **Usuario Asociado**: Un Personal puede tener un Usuario del sistema asociado
3. **PIN de Acceso**: Personal puede tener PIN para control de asistencia
4. **Jerarquía**: Los Cargos tienen un nivel jerárquico
5. **Filtros**: Implementar filtros en el backend para mejor performance

## Integración con Otros Módulos

- **Sistemas**: Personal puede ser Usuario del sistema
- **Control de Accesos**: Personal usa PIN para acceso físico
- **Menús**: Permisos de acceso a módulos según rol del usuario

## Archivos Clave

### Backend
- `api_laravel/routes/api/rrhh.php` - Rutas RRHH
- `api_laravel/app/Http/Controllers/RRHH/PersonalController.php`
- `api_laravel/app/Http/Controllers/RRHH/CargoController.php`
- `api_laravel/app/Models/RRHH/Personal.php`
- `api_laravel/app/Models/RRHH/Cargo.php`

### Frontend
- `react_vite/src/pages/rrhh/Personal/PersonalPage.jsx`
- `react_vite/src/pages/rrhh/Cargos/CargosPage.jsx`
- `react_vite/src/services/personalService.js`
- `react_vite/src/services/cargoService.js`
