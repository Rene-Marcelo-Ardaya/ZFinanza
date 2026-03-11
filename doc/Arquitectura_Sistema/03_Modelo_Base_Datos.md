# Modelo de Base de Datos - ZFinanza

Esquema actual organizado por módulo. Actualizar cada vez que se cree o modifique una migración.

---

## Módulo: Transversal

### users
Usuarios del sistema (cuentas de acceso).
- id (PK)
- name (string)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string, bcrypt)
- remember_token (string, nullable)
- is_active (boolean, default: true)
- id_personal (FK → personal.id, nullable)
- timestamps

### sessions
Sesiones activas (driver base de datos).
- id (varchar, PK)
- user_id (FK → users.id, nullable)
- ip_address (varchar 45, nullable)
- user_agent (text, nullable)
- payload (longtext)
- last_activity (integer, index)

### password_reset_tokens
Tokens para reseteo de contraseña.
- email (varchar, PK)
- token (string)
- created_at (timestamp, nullable)

### personal_access_tokens
Tokens de Sanctum para autenticación de la API.
- id (PK)
- tokenable_type + tokenable_id (polymorphic)
- name (string)
- token (varchar 64, unique)
- abilities (text, nullable) — permisos en JSON
- last_used_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- timestamps

---

## Módulo: Sistemas

### roles
Roles que agrupan permisos y menús.
- id (PK)
- name (varchar 100)
- slug (varchar 100, unique)
- description (text, nullable)
- is_active (boolean, default: true)
- session_timeout (integer, nullable) — en minutos
- timestamps

### permissions
Permisos granulares por módulo.
- id (PK)
- name (string)
- slug (string, unique) — ej: "users.create"
- module (string) — módulo al que pertenece
- description (text, nullable)
- timestamps

### menus
Ítems del menú lateral de la aplicación.
- id (PK)
- name (string)
- url (string, nullable) — ruta frontend ej: /rrhh/cargos
- icon (string, nullable) — nombre del ícono ej: FiUsers
- parent_id (FK → menus.id, nullable) — jerarquía padre/hijo
- order (integer, default: 0)
- module (string, nullable) — agrupador visual ej: "RRHH"
- is_active (boolean, default: true)
- timestamps

### settings
Configuraciones clave-valor de la aplicación.
- id (PK)
- key (varchar 100, unique) — ej: "app_logo"
- value (text, nullable)
- type (varchar 50, default: "string") — string | integer | boolean | json
- group (varchar 50, default: "general") — ej: "branding"
- is_public (boolean, default: false) — si es accesible sin auth
- description (text, nullable)
- timestamps

### niveles_seguridad
Niveles de restricción para componentes de la UI (SecuredButton System).
- id (PK)
- nombre (varchar 100)
- descripcion (text, nullable)
- nivel (integer, default: 1) — orden numérico del nivel
- is_active (boolean, default: true)
- timestamps

### componente_seguridad
Componentes de la UI con nivel de seguridad asignado.
- id (PK)
- nombre (varchar 100)
- descripcion (text, nullable)
- nivel_seguridad_id (FK → niveles_seguridad.id, nullable)
- is_active (boolean, default: true)
- timestamps

---

## Módulo: RRHH

### cargos
Puestos de trabajo disponibles en la organización.
- id (PK)
- nombre (varchar 100)
- descripcion (text, nullable)
- is_active (boolean, default: true)
- timestamps

### personal
Empleados y colaboradores de la organización.
- id (PK)
- nombre (varchar 100)
- apellido_paterno (varchar 100)
- apellido_materno (varchar 100, nullable)
- ci (varchar 20, unique, nullable) — cédula de identidad
- pin (string, nullable) — PIN encriptado (bcrypt) para acceso físico
- fecha_nacimiento (date, nullable)
- genero (enum: M | F | O, nullable)
- direccion (text, nullable)
- telefono (varchar 20, nullable)
- email (string, nullable)
- cargo_id (FK → cargos.id, RESTRICT on delete)
- nivel_seguridad_id (FK → niveles_seguridad.id, nullable)
- fecha_ingreso (date, nullable)
- fecha_salida (date, nullable)
- salario (decimal 12,2, nullable)
- tipo_contrato (varchar 50, nullable)
- estado (enum: activo | inactivo, default: activo)
- observaciones (text, nullable)
- user_id (FK → users.id, unique, nullable)
- is_active (boolean, default: true)
- timestamps

### ubicacion_pins
Puntos físicos donde se registran los accesos PIN.
- id (PK)
- nombre (varchar 100) — ej: "Entrada Principal"
- descripcion (text, nullable)
- ubicacion (string, nullable) — descripción física
- is_active (boolean, default: true)
- timestamps

### personal_pin_acceso
Registro histórico de accesos por PIN.
- id (PK)
- personal_id (FK → personal.id, CASCADE delete)
- ubicacion_id (FK → ubicacion_pins.id, nullable)
- fecha_acceso (timestamp, default: NOW())
- tipo_acceso (varchar 50, nullable) — ENTRADA | SALIDA
- timestamps

---

## Módulo: Negocios

### negocios
Negocios o empresas registradas en el sistema.
- id (PK)
- nombre (varchar 100)
- is_active (boolean, default: true)
- timestamps

### base_datos
Configuraciones de bases de datos externas.
- id (PK)
- nombre (varchar 100)
- descripcion (text, nullable)
- host (string)
- puerto (integer)
- usuario_bd (string)
- password_bd (string)
- activo (boolean, default: true)
- timestamps

---

## Módulo: Finanzas

### f_cuentas
Cuentas financieras del sistema.
- id (PK)
- nombre (varchar 255) — nombre de la cuenta
- descripcion (text, nullable) — descripción opcional
- is_active (boolean, default: true) — estado activo/inactivo
- timestamps
- índices: is_active, nombre

---

## Tablas Pivot (N:M)

- role_user → roles ↔ users
- permission_role → permissions ↔ roles
- menu_role → menus ↔ roles
- negocio_user → negocios ↔ users

---

## Relaciones Clave

- Un `user` puede tener muchos `roles` (N:M via role_user)
- Un `role` puede tener muchos `permissions` (N:M via permission_role)
- Un `role` puede tener muchos `menus` (N:M via menu_role)
- Un `menu` puede tener sub-ítems (self-referential: parent_id → menus.id)
- Un `personal` pertenece a un `cargo`
- Un `personal` puede tener un `nivel_seguridad`
- Un `personal` puede estar vinculado a un `user` (user_id)
- Un `user` puede estar vinculado a un `personal` (id_personal)
- Un `personal` tiene muchos registros en `personal_pin_acceso`
- Un `componente_seguridad` pertenece a un `nivel_seguridad`
- Un `user` puede tener muchos `negocios` (N:M via negocio_user)
- Un `negocio` puede tener muchos `users` (N:M via negocio_user)

---

## Módulo: Finanzas

### f_cuentas
- Tabla principal de cuentas financieras
- Campos: id, nombre, descripcion, is_active, timestamps
- Índices: is_active, nombre
- Scopes: active(), search()


> Para nuevos módulos: crear una migración consolidada en `database/migrations/` con el prefijo de fecha y nombre descriptivo, ej: `2026_04_01_000001_create_ventas_tables.php`.
