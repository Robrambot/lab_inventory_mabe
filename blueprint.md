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
- **Almacenamiento de Archivos:** Cloudinary
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

## 3. Plan de Acción (Versión 2)

Este es el plan de trabajo para la funcionalidad de **"Añadir Nuevo Instrumento"**.

1.  **Crear la Rama de Desarrollo:**
    - Crear y moverse a una nueva rama de feature: `git checkout -b feature/add-instrument-form`.

2.  **Añadir el Botón en "Inventario":**
    - Modificar `src/pages/Inventario.jsx`.
    - Añadir un "Floating Action Button" (FAB) de MUI en la esquina inferior derecha.
    - Este botón navegará a la nueva ruta `/inventario/nuevo`.

3.  **Crear la Nueva Página y Ruta:**
    - Crear el nuevo archivo de página: `src/pages/NuevoInstrumento.jsx`.
    - Actualizar `App.jsx` para registrar la ruta `/inventario/nuevo` y asociarla al componente `NuevoInstrumento`.

4.  **Construir el Formulario de Nuevo Instrumento:**
    - En `NuevoInstrumento.jsx`, construir un formulario usando componentes de MUI.
    - Incluirá campos para: `nombre`, `identificador`, `marca`, `modelo`, `observaciones`.
    - Incluirá un componente para capturar/subir una foto.

5.  **Implementar la Lógica de Guardado:**
    - Al enviar el formulario:
        a. Subir la imagen del instrumento a **Cloudinary** (reutilizando la lógica existente).
        b. Obtener la URL de la imagen.
        c. Crear un nuevo documento en la colección `instrumentos` de Firestore.
        d. El documento contendrá todos los campos del formulario más la `fotoURL` y un `estado` por defecto de `"disponible"`.
    - Tras guardar con éxito, redirigir al usuario de vuelta a la página de Inventario y mostrar una notificación de éxito.

6.  **Fusionar y Desplegar:**
    - Una vez que la funcionalidad esté completa y probada, fusionar (merge) la rama `feature/add-instrument-form` de vuelta a `main`.
    - Subir los cambios a GitHub.
