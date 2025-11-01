# Login App - Expo + React Native + TypeScript

## Descripción

Esta aplicación móvil está desarrollada con **React Native** y **Expo**, utilizando **TypeScript** y **Expo Router** para la navegación. Permite iniciar sesión con validación de contraseña y muestra el email ingresado en la pantalla de perfil.

## Repositorio

[https://github.com/MagikarpSama/login_app.git](https://github.com/MagikarpSama/login_app.git)

## Características
- Pantalla de Login con campos de Email y Password (modo seguro).
- Validación de correo electrónico: solo permite emails válidos.
- Validación de contraseña: solo permite “1234”.
- Botón para mostrar/ocultar contraseña.
- Navegación con Expo Router.
- Vista principal con Tabs: Home (bienvenida) y Perfil (muestra el email).
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
- Ingresa tu email y la contraseña “1234”.
- Si el email está vacío o el formato es incorrecto, verás un mensaje de error.
- Si la contraseña es incorrecta, verás el mensaje “Contraseña incorrecta”.
- Si es correcta, accederás a la vista principal con Tabs:
  - **Home:** muestra un mensaje de bienvenida.
  - **Perfil:** muestra el email ingresado.
- En Perfil puedes cerrar sesión con el botón “Cerrar sesión”, lo que te regresa al Login y limpia el historial.
- Puedes mostrar/ocultar la contraseña con el botón correspondiente.

## Video demostrativo

[Enlace a video de funcionamiento](https://www.loom.com/ o https://www.youtube.com/)

---

**Autor:** Daniel
