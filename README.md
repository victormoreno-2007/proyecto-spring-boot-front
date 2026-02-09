# 🎨 ConstruRenta UI - Frontend

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-Fast_Build-purple)
![CSS](https://img.shields.io/badge/Style-CSS_Modules-orange)

Bienvenido a la interfaz de usuario de **ConstruRenta**. Esta aplicación web progresiva (SPA) ha sido diseñada para ofrecer una experiencia fluida, moderna y responsiva, permitiendo la gestión eficiente del alquiler de maquinaria pesada y herramientas.

Desarrollada con **React 18** y **TypeScript**, la aplicación se centra en la usabilidad, la seguridad mediante la gestión de estados globales y la protección de rutas basada en roles.

## 🔗 Enlaces del Proyecto
- **⚙️ Repositorio Backend:** [GitHub - Proyecto Backend](https://github.com/victormoreno-2007/proyecto-spring-boot.git)

---

## 💡 Experiencia de Usuario (UX)

La plataforma está diseñada pensando en tres perfiles de usuario distintos, ofreciendo interfaces personalizadas para cada uno:

### 🛡️ Panel de Administrador
* **Dashboard Visual:** Gráficos y tarjetas estadísticas para monitorear ingresos y usuarios activos.
* **Gestión Centralizada:** Tablas interactivas para administrar usuarios y reportes de daños.

### 👷 Panel de Proveedor
* **Gestión de Inventario:** Formularios intuitivos para crear y editar herramientas, con previsualización de imágenes en tiempo real.
* **Control de Rentas:** Vista clara de herramientas alquiladas y gestión de devoluciones.

### 👤 Portal del Cliente
* **Catálogo Dinámico:** Exploración de herramientas con indicadores de stock y disponibilidad en tiempo real.
* **Proceso de Reserva:** Carrito de compras, selección de fechas mediante calendario y pasarela de pago simulada.
* **Historial:** Acceso a reservas pasadas y facturas digitales.

---

## 💻 Stack Tecnológico

* **Core:** React 18 + TypeScript (Tipado estricto para mayor robustez).
* **Build Tool:** Vite (Para un entorno de desarrollo ultrarrápido).
* **Estilos:** CSS Modules (Estilos encapsulados y mantenibles) + Diseño Responsivo.
* **Conexión API:** Axios (Configurado con Interceptores para inyectar el Token JWT automáticamente).
* **Estado Global:** React Context API (Gestión de Autenticación `AuthContext` y Carrito de Compras `CartContext`).
* **Routing:** React Router DOM v6 (Con componentes `PrivateRoute` para seguridad).

---

## 📂 Estructura del Proyecto

El proyecto sigue una estructura modular y escalable:

```text
src/
├── components/       # Bloques de construcción de la UI
│   ├── common/       # Header, Footer, Modales (Reutilizables)
│   └── Tools/        # Tarjetas de productos y listados
│
├── contexts/         # Gestión del Estado Global
│   ├── AuthContext   # Manejo de sesión y roles
│   └── CartContext   # Lógica del carrito de compras
│
├── layouts/          # Plantillas maestras (MainLayout)
│
├── pages/            # Vistas principales por Rol
│   ├── admin/        # Reportes y Usuarios
│   ├── client/       # Home, Carrito, Mis Reservas
│   ├── provider/     # Inventario, Gestión de Rentas
│   └── ...           # Login, Registro, Perfil
│
├── services/         # Capa de Comunicación con el Backend
│   ├── api.ts        # Configuración base de Axios
│   └── ...           # Servicios específicos (toolService, bookingService)
│
└── routes/           # Definición de rutas y Guardias de Seguridad

```

---

## 🚀 Instrucciones de Instalación

Sigue estos pasos para desplegar el frontend en tu máquina local:

### 1. Prerrequisitos

* Tener instalado **Node.js** (v16 o superior).
* Tener el **Backend** ejecutándose en `http://localhost:8080` (Requerido para el Login y datos).

### 2. Clonar e Instalar

```bash
git clone [https://github.com/victormoreno-2007/proyecto-spring-boot-front.git](https://github.com/victormoreno-2007/proyecto-spring-boot-front.git)
cd proyecto-spring-boot-front
npm install

```

### 3. Ejecutar en Desarrollo

```bash
npm run dev

```

### 4. Acceso

Abre tu navegador (Chrome/Edge recomendado) en:
👉 `http://localhost:5173`

---

## 🔐 Credenciales de Prueba

El sistema viene pre-cargado con usuarios para probar cada rol inmediatamente:

| Rol | Email | Contraseña | Funcionalidad Principal |
| --- | --- | --- | --- |
| **Admin** | `admin@construrenta.com` | `123456` | Ver reportes financieros y usuarios. |
| **Cliente** | `sebastian@cliente.com` | `123456` | Alquilar herramientas y ver carrito. |
| **Proveedor** | `marcela@proveedor.com` | `123456` | Crear herramientas y gestionar stock. |

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado con pasión y buenas prácticas por:

| Desarrollador | Rol Principal |
| --- | --- |
| **Marcela Albarracin** | 
| **Sebastian Jaimes** |
| **Victor Moreno** |

---

*© 2024 ConstruRenta UI - Todos los derechos reservados.*

```

```