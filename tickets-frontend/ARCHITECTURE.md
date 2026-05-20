# Arquitectura y Flujo de Autenticación

## Diagrama de Flujo de Login

```
┌─────────────────────────────────────────────────────────────────┐
│                      PANTALLA DE LOGIN                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Formulario                                                │  │
│  │  - username [_____________]                               │  │
│  │  - password [_____________]                               │  │
│  │                    [Iniciar Sesión]                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Usuario ingresa credenciales
                     │
                     ▼
┌────────────────────────────────────────────────────────────────────┐
│               ApiService.login(credentials)                        │
│                                                                    │
│  POST /api/auth/login                                            │
│  {                                                               │
│    "username": "admin",                                          │
│    "password": "admin123"                                        │
│  }                                                               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Request
                     │
                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                           │
│                  /api/auth/login endpoint                          │
│                                                                    │
│  1. Valida credenciales                                          │
│  2. Genera JWT token                                             │
│  3. Retorna respuesta                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Response con token
                     │
                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                  AuthContext.login() recibe                        │
│                                                                    │
│  {                                                               │
│    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",         │
│    "type": "Bearer",                                             │
│    "id": 1,                                                      │
│    "username": "admin",                                          │
│    "email": "admin@example.com",                                │
│    "nombre": "Admin",                                            │
│    "apellido": "User",                                           │
│    "role": "ADMIN"                                               │
│  }                                                               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 1. Guardar en localStorage
                     │ 2. Actualizar estado
                     │
                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                   localStorage                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."         │     │
│  │ user: {                                                  │     │
│  │   id: 1,                                                 │     │
│  │   username: "admin",                                     │     │
│  │   nombre: "Admin",                                       │     │
│  │   role: "ADMIN"                                          │     │
│  │ }                                                        │     │
│  └──────────────────────────────────────────────────────────┘     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Redirigir a /dashboard
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Protegido)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Bienvenido, Admin User                [Cerrar Sesión]  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  Usuario: admin                                         │   │
│  │  Email: admin@example.com                               │   │
│  │  Rol: ADMIN                                             │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Protección de Rutas

```
┌──────────────────────────────────────┐
│  Usuario intenta acceder a /dashboard│
└────────────┬─────────────────────────┘
             │
             ▼
      ┌─────────────────┐
      │ PrivateRoute    │
      │ verifica si:    │
      │ - isLoading?    │
      │ - isAuth?       │
      └────────┬────────┘
               │
        ┌──────┴──────────────┐
        │                     │
   ┌────▼─────┐      ┌───────▼────┐
   │ Cargando  │      │ No Auth    │
   │           │      │            │
   │ Spinner   │      │ Redirigir  │
   │           │      │ a /login   │
   │           │      │            │
   └───────────┘      └────────────┘
        ▲
        │
        │
   ┌────▼──────────────┐
   │ isAuthenticated=  │
   │ true              │
   │                   │
   │ Renderizar        │
   │ Dashboard         │
   └───────────────────┘
```

## Componentes Principales

### 1. **AuthContext.tsx**
Gestiona el estado global de autenticación.

```
AuthProvider
├── user: User | null
├── token: string | null
├── isLoading: boolean
├── error: string | null
├── login(username, password): Promise
├── logout(): void
└── isAuthenticated: boolean
```

### 2. **LoginPage.tsx**
Formulario de autenticación que consume AuthContext.

```
LoginPage
├── Formulario con campos:
│   ├── username
│   └── password
├── Botón submit
├── Manejo de errores locales
└── Redireccionamiento a /dashboard
```

### 3. **PrivateRoute.tsx**
Componente que protege rutas requiriendo autenticación.

```
PrivateRoute
├── Verifica isAuthenticated
├── Si es false → Redirige a /login
├── Si es true → Renderiza children
└── Mientras carga → Muestra spinner
```

### 4. **ApiService**
Servicio centralizado para llamadas HTTP.

```
ApiService
├── axiosInstance configurado
├── Interceptores para:
│   ├── Agregar token automáticamente
│   └── Manejar errores 401
└── login(credentials): Promise<JwtResponse>
```

## Flujo de Autenticación con Interceptores

```
┌────────────────┐
│ Cada Petición  │
└────────┬───────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │ Request Interceptor             │
    │                                 │
    │ 1. Obtener token de localStorage│
    │ 2. Agregar header:              │
    │    Authorization: Bearer {token}│
    │ 3. Continuar con petición       │
    └────────────┬────────────────────┘
                 │
                 ▼
        ┌─────────────────────┐
        │  Petición HTTP      │
        │  con token          │
        │  Authorization: ... │
        └────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────────────┐
    │ Response Interceptor            │
    │                                 │
    │ ¿Status = 401?                  │
    └────────┬────────────────────────┘
             │
        ┌────┴────────────────────┐
        │                         │
    ┌───▼────┐          ┌────────▼──┐
    │ Sí     │          │ No        │
    │ 401    │          │ Continuar │
    ├────────┤          └───────────┘
    │ 1. Limpia│
    │   localStorage│
    │ 2. Redirige
    │    a /login
    └────────┘
```

## Flujo al Recargar la Página

```
┌─────────────────────────────────────┐
│  Usuario recarga la página           │
│  (F5 o cierra/abre el navegador)    │
└────────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ useEffect en AuthProvider       │
    │                                 │
    │ 1. Obtener token de localStorage│
    │ 2. Obtener user de localStorage │
    │ 3. Restaurar estado             │
    │ 4. Usuario sigue autenticado    │
    └─────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Usuario mantenido en sesión     │
    │ Sin necesidad de login nuevamente│
    └─────────────────────────────────┘
```

## Seguridad

### ¿Dónde se almacena el token?
- **localStorage**: Fácil de usar pero vulnerable a XSS
- Para producción, considera usar HttpOnly cookies

### Protección CORS
```
Backend permite:
spring.web.cors.allowed-origins=http://localhost:5173

Frontend solo puede hacer peticiones a localhost:8080
desde localhost:5173
```

### Validación de Token
- El backend valida cada token en los endpoints protegidos
- Si el token es inválido/expirado, retorna 401
- El interceptor de Axios redirige automáticamente a login

### Validación de Rol (en el backend)
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/registro")
public ResponseEntity<?> register(...) { }
```

## Manejo de Errores

### En el Frontend

1. **Error de Login**
   - Usuario ve mensaje de error en el formulario
   - No se guarda token
   - Permanece en /login

2. **Error en Petición Autenticada**
   - Si es 401: Redirige a /login
   - Si es otro error: Se puede mostrar en componentes específicos

3. **Error de Red**
   - Axios lanza excepción que se puede capturar con .catch()

### En el Backend

1. **Credenciales Inválidas**
   - Retorna error en response
   - No genera token

2. **Token Expirado**
   - Retorna 401
   - Frontend redirige a login

3. **Acceso No Autorizado**
   - Retorna 403 Forbidden
   - User no tiene permisos necesarios

## Ejemplo de Uso en Componentes

```typescript
// En cualquier componente protegido
import { useAuth } from './context/useAuth';

export function MyComponent() {
  const { user, logout } = useAuth();

  // user contiene: { id, username, email, nombre, apellido, role }
  // logout() limpia localStorage y redirige a login

  return (
    <div>
      <h1>Hola, {user?.nombre}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Consideraciones para Producción

1. **Usar HttpOnly Cookies** en lugar de localStorage
2. **HTTPS obligatorio** para el token
3. **Refresh Tokens** para renovar token expirado
4. **CSRF Protection** en el backend
5. **Rate Limiting** en login
6. **Validación adicional** del lado del servidor
7. **Logs de autenticación** para auditoría
