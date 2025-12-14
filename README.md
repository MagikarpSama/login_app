# Login App - Expo + React Native + TypeScript

## Descripción

Esta aplicación móvil está desarrollada con **React Native** y **Expo**, utilizando **TypeScript** y **Expo Router** para la navegación. Permite iniciar sesión con validación de contraseña y muestra el email ingresado en la pantalla de perfil.

## Repositorio

[https://github.com/MagikarpSama/login_app.git]


## Características
- Pantalla de Login con campos de Email y Password (modo seguro).
- Validación de correo electrónico: permite cualquier email válido.
- Validación de contraseña: solo permite “password123”.
- Botón para mostrar/ocultar contraseña.
- Navegación con Expo Router.
- Vista principal con Tabs: Home (bienvenida), Perfil (muestra el email) y TODO List.
 - TODO List:
   - Crear tareas con título, foto y localización actual (se muestra un mapa con la ubicación).
   - Editar tareas existentes (título, foto, localización) desde un modal.
   - Eliminar tareas creadas.
   - Marcar tareas como completadas o no completadas (toggle con PUT al backend).
   - Las tareas están asociadas al usuario logueado y solo son visibles para ese usuario.
   - Las tareas se sincronizan con el backend y se actualizan en tiempo real en la app.
   - Compatible con emulador, dispositivo físico y web.
- Manejo de estado con React Hooks (`useState`, `useEffect`).
- Botón de cerrar sesión en Perfil (usa router.replace para evitar retroceso).
- Código ordenado y buenas prácticas de TypeScript y React.

## Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/MagikarpSama/login_app.git
   cd login-app
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el proyecto:**
   ```bash
   npx expo start
   ```

4. **Abre la app:**
   - En el navegador: [http://localhost:8081/login](http://localhost:8081/login)
   - En dispositivo físico o emulador usando la app Expo Go.

## Funcionamiento

- Al abrir la app, verás la pantalla de Login.
- Ingresa un email cualquiera y la contraseña “password123”.
- Si el email está vacío o el formato es incorrecto, verás un mensaje de error.
- Si la contraseña es incorrecta, verás el mensaje “Contraseña incorrecta”.
- Si es correcta, accederás a la vista principal con Tabs:
   - **Home:** muestra un mensaje de bienvenida.
   - **Perfil:** muestra el email ingresado y permite cerrar sesión.
   - **TODO List:**
      - Puedes crear nuevas tareas con título, foto y localización.
      - Puedes editar cualquier tarea existente tocando el ícono ✏️ (se abre un modal con el formulario editable).
      - Puedes marcar una tarea como completada o no con el botón de check/círculo (se actualiza en el backend).
      - Puedes eliminar tareas con el ícono de papelera.
      - Todos los cambios se reflejan en tiempo real y se sincronizan con el backend.
      - Solo ves tus propias tareas.

## Integración backend

- Todas las operaciones de tareas (crear, editar, eliminar, toggle) usan endpoints REST protegidos con JWT.
- El login y registro usan endpoints `/auth`.
- Las imágenes se suben a `/images` y se referencian por URL en las tareas.

## Video demostrativo

https://youtu.be/rP9WHtU8x18 Login
https://www.youtube.com/shorts/eCyRQDQ0IJs TODO list

---

**Autor:** Daniel Ignacio Romero Zapata

