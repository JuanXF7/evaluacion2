export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: 'ADMIN' | 'TECNICO' | 'USUARIO';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: 'ADMIN' | 'TECNICO' | 'USUARIO';
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Ticket {
  id?: number;
  _id?: string;
  titulo?: string;
  title?: string;
  descripcion?: string;
  status?: string;
  estado?: string;
  prioridad?: string;
  priority?: string;
  categoriaId?: number;
  categoriaNombre?: string;
  category?: string;
  categoria?: string;
  asignadoAId?: number;
  asignadoAUsername?: string;
  asignadoANombreCompleto?: string;
  assignedUser?: string;
  usuario?: string;
  createdAt?: string;
  updatedAt?: string;
  fecha?: string;
}

export interface TicketRequest {
  titulo: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status?: 'ABIERTO' | 'EN_PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO';
  categoriaId?: number;
  asignadoAId?: number;
  closedAt?: string;
}
