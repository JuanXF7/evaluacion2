# Tickets Frontend

Sistema de Frontend para la gestión de tickets con autenticación JWT.

## Características

- ✅ Login con JWT
- ✅ Protección de rutas
- ✅ Gestión de token en localStorage
- ✅ Context API para autenticación
- ✅ Interfaz responsiva
- ✅ Manejo de errores

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── PrivateRoute.tsx # Componente para proteger rutas
├── context/             # Context API
│   ├── AuthContext.tsx  # Proveedor de autenticación
│   └── useAuth.ts       # Hook personalizado
├── pages/               # Páginas de la aplicación
│   ├── LoginPage.tsx    # Página de login
│   └── Dashboard.tsx    # Dashboard protegido
├── services/            # Servicios de API
│   └── api.ts           # Cliente HTTP con axios
├── types/               # Tipos TypeScript
│   └── index.ts         # Definiciones de tipos
└── App.tsx              # Componente principal
```

## Flujo de Autenticación

1. Usuario ingresa credenciales en LoginPage
2. Se envía petición POST a `/api/auth/login`
3. Backend retorna JWT token y datos del usuario
4. Token y usuario se guardan en localStorage
5. Usuario es redirigido a /dashboard
6. PrivateRoute verifica autenticación
7. Si no está autenticado, redirige a /login
8. Al logout se limpian localStorage y estado
## Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Credenciales de Prueba

```
Usuario: admin
Contraseña: admin123
```

## Tecnologías Utilizadas

- React 18.2.0
- TypeScript 5.3.0
- React Router 6.21.0
- Axios 1.6.0
- Vite 5.0.0
