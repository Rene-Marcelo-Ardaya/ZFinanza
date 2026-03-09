# Skills de ZFinanza

Esta carpeta contiene skills especializados para trabajar con el proyecto ZFinanza. Los skills son archivos con instrucciones especializadas que la IA puede cargar para enfocarse en áreas específicas del proyecto.

## Propósito

Los skills permiten que la IA interprete el proyecto de manera eficiente sin tener que revisar código por código o documentación completa. Cada skill está enfocado en un área específica del proyecto.

## Skills Disponibles

### Skill Principal
- **`zfinanza-index.md`** - Router principal que dirige a otros skills según el tema

### Skills por Componente
- **`zfinanza-api.md`** - Especializado en la API Laravel (backend)
- **`zfinanza-frontend.md`** - Especializado en el frontend React con Vite
- **`zfinanza-rrhh.md`** - Especializado en el módulo de Recursos Humanos
- **`zfinanza-sistemas.md`** - Especializado en el módulo de Sistemas

## Cómo Usar

Cuando trabajes con la IA en este proyecto, indica qué skill cargar según tu necesidad:

```
"Por favor, carga el skill zfinanza-api para trabajar en la API Laravel"
```

O usa el skill principal:
```
"Por favor, carga el skill zfinanza-index para que la IA identifique el área correcta"
```

## Estructura del Proyecto

```
ZFinanza/
├── api_laravel/          # API Laravel (Backend)
├── react_vite/           # Frontend React (Frontend)
├── doc/                  # Documentación
└── skills/               # Skills de IA (esta carpeta)
```

## Módulos Principales

### RRHH (Recursos Humanos)
- Gestión de personal
- Cargos y roles
- Control de asistencia

### Sistemas
- Gestión de usuarios
- Control de accesos
- Menús y permisos
- Niveles de seguridad
- Negocios
