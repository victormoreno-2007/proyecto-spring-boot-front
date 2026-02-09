# 🏗️ ConstruRenta UI - Frontend

Interfaz moderna e intuitiva para la plataforma de alquiler de maquinaria. Desarrollada con **React** y **TypeScript**, enfocada en la experiencia de usuario y la gestión eficiente de roles.

## 🔗 Enlaces del Proyecto
- **Repositorio Backend:** `https://github.com/victormoreno-2007/proyecto-spring-boot.git`

## 💻 Tecnologías Utilizadas
- **Framework:** React 18 + TypeScript
- **Estilos:** CSS Modules + Diseño Responsivo
- **Estado y API:** Axios (Interceptores JWT) + Context API
- **Enrutamiento:** React Router DOM (Protección de rutas por Roles)
- **Build Tool:** Vite

## 📸 Características Visuales
- **Dashboard Administrativo:** Gráficos y tablas de reportes en tiempo real.
- **Catálogo Interactivo:** Tarjetas de productos con estados (Disponible/Agotado).
- **Gestión de Roles:**
  - 🛡️ **Admin:** Control total de usuarios y reportes.
  - 👷 **Proveedor:** Gestión de inventario propio.
  - 👤 **Cliente:** Carrito de compras, reservas e historial.

## 🚀 Instrucciones de Ejecución

### Prerrequisitos
- Node.js (v16 o superior).
- Backend ejecutándose en `http://localhost:8080`.

### Pasos
1. **Instalar dependencias:**
   ```bash
   npm install

```

2. **Ejecutar en desarrollo:**
```bash
npm run dev

```


3. **Acceso:**
Abra su navegador en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```text
src/
├── components/   # Componentes reutilizables (Modales, Tarjetas, Header)
├── contexts/     # Gestión de estado global (Auth, Cart)
├── layouts/      # Plantillas de diseño (MainLayout)
├── pages/        # Vistas por rol (Admin, Client, Provider)
├── services/     # Comunicación con API Backend (Axios)
└── routes/       # Configuración de Rutas y Guardias de Seguridad

```

## 🔐 Usuarios de Prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Admin | `admin@construrenta.com` | `123456` |
| Cliente | `sebastian@cliente.com` | `123456` |
| Proveedor | `marcela@proveedor.com` | `123456` |

---

**Desarrollado por:** Marcela Albarracin, Sebastian Jaimes y Victor Moreno

```

---


