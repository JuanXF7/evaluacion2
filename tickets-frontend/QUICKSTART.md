# 🚀 Guía Rápida de Inicio

## 1️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React 18.2.0
- React Router 6.21.0
- Axios 1.6.0
- TypeScript 5.3.0
- Vite 5.0.0

## 2️⃣ Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

## 3️⃣ Iniciar el Backend (en otra terminal)

```bash
cd ../tickets-backend
mvn spring-boot:run
```

O si usas Maven desde VS Code:
- Presiona `Ctrl+Shift+D` (Ejecutar y Depurar)
- Selecciona Spring Boot app

## 4️⃣ Probar el Login

Accede a http://localhost:5173 y usa:

```
Usuario: admin
Contraseña: admin123
```

Si tienes otras credenciales, puedes usarlas también.

## 📋 Lo que Puedes Hacer Ahora

✅ **Login con JWT**
- Pantalla de inicio de sesión funcional
- Token se guarda en localStorage
- Token se incluye automáticamente en todas las peticiones

✅ **Protección de Rutas**
- `/login` - Accesible sin autenticación
- `/dashboard` - Solo accesible si estás autenticado
- `/` - Redirige a dashboard

✅ **Manejo de Sesión**
- La sesión persiste al recargar la página
- Logout limpia todo y redirige a login
- Error 401 automáticamente redirige a login

✅ **Información del Usuario**
- Dashboard muestra datos del usuario
- Roles de usuario (ADMIN, AGENT, CLIENT)
- Email y nombre completo

## 🔧 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `src/App.tsx` | Rutas principales de la app |
| `src/context/AuthContext.tsx` | Gestión de estado de autenticación |
| `src/services/api.ts` | Cliente HTTP con interceptores |
| `src/pages/LoginPage.tsx` | Pantalla de login |
| `src/components/PrivateRoute.tsx` | Componente para proteger rutas |
| `.env` | Variables de entorno |

## 🐛 Solucionar Problemas Comunes

### Error: "Cannot reach backend"
```
✅ Asegúrate de que el backend está corriendo en http://localhost:8080
✅ Verifica que VITE_API_BASE_URL en .env es correcto
```

### Error: "CORS error"
```
✅ El backend debe permitir CORS desde http://localhost:5173
✅ Verifica: spring.web.cors.allowed-origins en application.properties
```

### Login no funciona
```
✅ Verifica las credenciales en el backend
✅ Abre DevTools (F12) → Network → Revisa la petición a /api/auth/login
✅ Revisa la consola por errores JavaScript
```

### Token no se guarda
```
✅ Verifica que localStorage está habilitado
✅ No uses modo privado/incógnito del navegador
✅ Abre DevTools → Application → Storage → localStorage
```

## 📚 Próximos Pasos

Después de tener funcionando el login, puedes:

1. **Crear página para listar tickets**
   - Consumir endpoint GET /api/tickets
   - Mostrar en tabla

2. **Crear formulario para nuevo ticket**
   - Consumir endpoint POST /api/tickets
   - Con validación del lado del cliente

3. **Agregar más rutas protegidas**
   - Gestión de usuarios
   - Categorías
   - Reportes

4. **Mejorar UI**
   - Componentes reutilizables
   - Sistema de diseño coherente
   - Animaciones y transiciones

5. **Testing**
   - Tests unitarios con Vitest
   - Tests de integración
   - Tests E2E con Cypress

## 🎨 Personalización

### Cambiar Colores
Edita los archivos CSS:
- `src/pages/LoginPage.css` - Colores del login
- `src/pages/Dashboard.css` - Colores del dashboard
- `src/App.css` - Estilos globales

Por defecto usa gradiente morado:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Agregar Componentes
```bash
# Crear componente nuevo
src/components/MiComponente.tsx
src/components/MiComponente.css
```

### Agregar Servicios
```bash
# Crear servicio para tickets
src/services/ticketService.ts
```

## 📱 Versión Móvil

La aplicación es responsiva. Los estilos se adaptan a:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)  
- 🖥️ Desktop (> 1024px)

## 🔐 Sobre la Seguridad

- ✅ Token JWT se valida en el backend
- ✅ CORS protege contra peticiones de otros dominios
- ✅ Roles de usuario controlados en el backend
- ⚠️ localStorage es vulnerable a XSS (mejora en producción)
- ⚠️ Usar HTTPS obligatorio en producción

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los archivos documentación: `SETUP.md`, `ARCHITECTURE.md`
2. Abre DevTools (F12) para debugging
3. Revisa los logs del backend
4. Busca errores en la consola del navegador

---

**¡Listo! Tu frontend de autenticación JWT está funcionando. 🎉**
