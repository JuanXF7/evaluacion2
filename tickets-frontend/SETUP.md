# Guía de Configuración y Uso

## Configuración Inicial

### 1. Clonar y navegar al proyecto

```bash
cd tickets-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está configurado con:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

Si el backend está en otro puerto, actualiza esta URL.

## Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

## Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Cómo Funciona la Autenticación

### 1. Pantalla de Login
- Usuario ingresa `username` y `password`
- Se envía petición a `POST /api/auth/login`
- Backend valida credenciales y retorna JWT

### 2. Almacenamiento del Token
- El token se guarda en `localStorage` bajo la clave `token`
- Los datos del usuario se guardan bajo `user`
- Los datos se mantienen aunque se recargue la página

### 3. Protección de Rutas
- El componente `PrivateRoute` verifica si el usuario está autenticado
- Si no hay token, redirige a `/login`
- Si hay token, permite acceso a rutas protegidas

### 4. Interceptores de Axios
- Cada petición automáticamente incluye el header `Authorization: Bearer {token}`
- Si el servidor retorna 401, se limpia el token y redirige a login

### 5. Logout
- Limpia `localStorage`
- Limpia el estado de autenticación
- Redirige a `/login`

## Estructura de Carpetas

```
tickets-frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   └── PrivateRoute.tsx  # Componente para proteger rutas
│   ├── context/              # Context API para estado global
│   │   ├── AuthContext.tsx   # Proveedor de autenticación
│   │   └── useAuth.ts        # Hook personalizado
│   ├── pages/                # Páginas de la aplicación
│   │   ├── LoginPage.tsx     # Página de inicio de sesión
│   │   ├── LoginPage.css     # Estilos del login
│   │   ├── Dashboard.tsx     # Página protegida (dashboard)
│   │   └── Dashboard.css     # Estilos del dashboard
│   ├── services/             # Servicios de API
│   │   └── api.ts            # Cliente HTTP con Axios
│   ├── types/                # Tipos TypeScript
│   │   └── index.ts          # Definiciones de interfaces
│   ├── App.tsx               # Componente raíz
│   ├── App.css               # Estilos globales
│   └── main.tsx              # Punto de entrada
├── index.html                # HTML principal
├── package.json              # Dependencias del proyecto
├── tsconfig.json             # Configuración de TypeScript
├── vite.config.ts            # Configuración de Vite
├── .env                      # Variables de entorno
└── README.md                 # Este archivo
```

## Tipos de Datos Principales

### User
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: 'ADMIN' | 'AGENT' | 'CLIENT';
}
```

### JwtResponse
```typescript
interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: 'ADMIN' | 'AGENT' | 'CLIENT';
}
```

### AuthContextType
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

## Hook useAuth

Para usar la autenticación en cualquier componente:

```typescript
import { useAuth } from './context/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Usar en el componente
}
```

## Posibles Problemas y Soluciones

### Error: CORS
- Asegúrate de que el backend tenga CORS habilitado
- Verifica que `spring.web.cors.allowed-origins` incluya `http://localhost:5173`

### Error: "Cannot GET /dashboard"
- Vite redirige automáticamente rutas no encontradas a index.html
- React Router maneja la navegación del lado del cliente

### Token expirado
- El token dura 24 horas (86400000 ms)
- Cuando expira, el interceptor de Axios redirige a login automáticamente

### LocalStorage vacío
- Si usas modo privado/incógnito del navegador, localStorage no funciona
- Usa el navegador normal para desarrollo

## Próximas Funcionalidades

Una vez implementado el login, puedes agregar:

1. **Gestión de Tickets**
   - Listar tickets
   - Crear nuevos tickets
   - Ver detalles de ticket

2. **Asignación de Tickets**
   - Asignar tickets a agentes
   - Cambiar estado de tickets

3. **Comentarios**
   - Agregar comentarios a tickets
   - Ver historial de comentarios

4. **Categorías**
   - Gestionar categorías de soporte

5. **Panel de Control**
   - Estadísticas de tickets
   - Gráficos de rendimiento

## Dependencias

- **react**: Librería principal
- **react-dom**: Renderizado en el DOM
- **react-router-dom**: Enrutamiento del lado del cliente
- **axios**: Cliente HTTP
- **typescript**: Lenguaje de programación tipado
- **vite**: Empaquetador ultrarrápido
- **@vitejs/plugin-react**: Plugin de React para Vite

## Licencia

Este proyecto es parte del sistema de tickets para la Oficina de Soporte y Mantenimiento.
