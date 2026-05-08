# MabeLab Control - Blueprint

## 1. Visión General

**MabeLab Control** es una aplicación web responsiva diseñada para la gestión de inventario y préstamos de instrumentos en el laboratorio de mecánica de lavadoras de Mabe. El objetivo es digitalizar y simplificar el proceso manual actual, proporcionando una herramienta rápida y fácil de usar, especialmente en dispositivos móviles, con un enfoque en la evidencia fotográfica para cada movimiento.

Esta primera versión es un **Producto Mínimo Viable (MVP)** de uso interno, sin autenticación, que prioriza la simplicidad y la velocidad.

---

## 2. Esquema del Proyecto

Esta sección documenta el estado actual y las características implementadas en la aplicación.

### **Pila Tecnológica**
- **Frontend:** React (con Vite)
- **Base de Datos:** Cloud Firestore
- **Almacenamiento de Archivos:** ImageKit.io
- **Hosting:** Firebase Hosting
- **Librería de Componentes:** Material-UI (MUI)
- **Enrutamiento:** React Router DOM

### **Modelos de Datos (Firestore)**

**Colección: `instrumentos`**
- `nombre` (string)
- `modelo` (string)
- `identificador` (string)
- `tipo` (string: "unico" | "stock")
- `cantidadTotal` (number, solo para "stock")
- `cantidadDisponible` (number, solo para "stock")
- `estado` (string: "disponible" | "prestado" | "en mantenimiento" | "dañado" | "dado de baja")
- `ultimaFotoURL` (string)
- `observaciones` (string)
- `activo` (boolean)

**Colección: `prestamos`**
- `folio` (string, autogenerado)
- `solicitante` (string)
- `realizadoPor` (string)
- `fechaPrestamo` (timestamp)
- `fechaCompromisoDevolucion` (timestamp)
- `estado` (string: "activo" | "vencido" | "cerrado")
- `comentarios` (string)
- `items` (array de maps):
    - `instrumentoId` (string, referencia al doc en `instrumentos`)
    - `cantidad` (number)
    - `condicionSalida` (string)
    - `fotoSalidaURL` (string)
    - `condicionRetorno` (string)
    - `fotoRetornoURL` (string)
    - `fechaRetorno` (timestamp)
    - `estadoItem` (string: "prestado" | "devuelto")

**Colección: `bitacora`**
- `descripcion` (string)
- `usuario` (string)
- `fecha` (timestamp)

### **Estructura de Archivos y Componentes**
- `src/`
  - `components/`: Componentes reutilizables (ej. `Layout.jsx`, `InstrumentCard.jsx`).
  - `pages/`: Componentes que representan las pantallas principales.
    - `Dashboard.jsx`: Pantalla principal con tarjetas resumen.
    - `Inventario.jsx`: Lista y buscador de instrumentos.
    - `NuevoPrestamo.jsx`: Formulario para crear un nuevo préstamo.
    - `DetallePrestamo.jsx`: Vista para gestionar la devolución de un préstamo.
    - `Historial.jsx`: Vista para la bitacora y trazabilidad.
  - `services/`: Lógica de negocio y comunicación con servicios externos.
    - `firebase.js`: Configuración e inicialización de Firebase.
    - `firestoreService.js`: Funciones para interactuar con Firestore (CRUD).
    - `imagekitService.js`: Funciones para subir y gestionar imágenes con ImageKit.io.
  - `hooks/`: Hooks personalizados (ej. `useAuth.js` en el futuro).
  - `App.jsx`: Componente raíz con el enrutador.
  - `main.jsx`: Punto de entrada de la aplicación.

### **Estilo y Diseño**
- **Enfoque:** Mobile-first, responsivo.
- **Librería:** Material-UI (MUI).
- **Paleta de Colores:** Se definirá un tema principal basado en colores corporativos o una paleta moderna y limpia.
- **Tipografía:** Se utilizarán fuentes claras y legibles (Roboto por defecto con MUI).
- **Iconografía:** Se usará `@mui/icons-material` para una iconografía consistente.

---

## 3. Plan de Acción (MVP Inicial)

Este es el plan de trabajo para la solicitud actual.

1.  **Configuración del Entorno:**
    - **Instalar dependencias:** `firebase`, `react-router-dom`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `imagekit-javascript`.
    - **Crear archivo de configuración de Firebase:** `src/firebase.js` con placeholders para que el usuario complete sus credenciales.
    - **Configurar `mcp.json`:** Añadir la configuración del servidor de Firebase.

2.  **Estructura y Navegación Básica:**
    - Crear la estructura de carpetas (`pages`, `components`, `services`).
    - Configurar el enrutador principal en `App.jsx` con las rutas para `Dashboard`, `Inventario`, y `NuevoPrestamo`.
    - Crear un componente `Layout.jsx` con una barra de navegación simple (Bottom Navigation para móvil) que permita moverse entre las páginas.

3.  **Implementar la Pantalla Principal (Dashboard):**
    - Diseñar las tarjetas de resumen (`Total`, `Disponibles`, `Prestados`, etc.) usando MUI Card.
    - Por ahora, los datos serán estáticos.

4.  **Desarrollar Módulo de Inventario:**
    - Crear la página `Inventario.jsx`.
    - Implementar la funcionalidad de `firestoreService.js` para leer la colección `instrumentos`.
    - Mostrar los instrumentos en una lista o cuadrícula de tarjetas.
    - Añadir un campo de búsqueda para filtrar por `nombre` o `identificador`.

5.  **Crear Flujo de Préstamo:**
    - Diseñar el formulario en `NuevoPrestamo.jsx` para registrar un préstamo.
    - El formulario incluirá campos para `solicitante`, `realizadoPor` (dropdown), fechas y la posibilidad de añadir múltiples artículos.
    - Implementar la lógica para buscar y seleccionar instrumentos del inventario.
    - **Integrar la subida de imágenes a ImageKit.io para la `foto de salida`**.
    - Al guardar, crear el documento en la colección `prestamos` y actualizar el estado de los `instrumentos` correspondientes en Firestore.

6.  **Desarrollar Flujo de Devolución:**
    - Crear una vista `DetallePrestamo.jsx` para ver un préstamo activo.
    - Permitir registrar la devolución de cada artículo, incluyendo `condición de retorno` y `foto de retorno` (subida a ImageKit.io).
    - Al devolver, actualizar el estado del ítem en el préstamo, y el estado y `cantidadDisponible` del instrumento principal.

7.  **Implementar Historial y Bitácora:**
    - Cada vez que se cree un préstamo o se realice una devolución, se añadirá un registro a la colección `bitacora`.
    - Crear la página `Historial.jsx` para mostrar estos registros.

8.  **Estilos Finales y Responsividad:**
    - Asegurar que todas las pantallas y componentes sean completamente responsivos y se vean bien en dispositivos móviles y de escritorio.
    - Aplicar el tema de MUI de forma consistente.
