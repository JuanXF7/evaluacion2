import axios, { AxiosInstance } from 'axios';
import { LoginRequest, JwtResponse, ApiResponse, Ticket, TicketRequest, Category, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token a las peticiones
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autenticación
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<JwtResponse> {
    const response = await this.axiosInstance.post<ApiResponse<JwtResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  }

  async getTickets(): Promise<Ticket[]> {
    const response = await this.axiosInstance.get<ApiResponse<Ticket[]>>('/tickets');
    return response.data.data;
  }

  async createTicket(request: TicketRequest): Promise<Ticket> {
    const response = await this.axiosInstance.post<ApiResponse<Ticket>>('/tickets', request);
    return response.data.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.axiosInstance.get<ApiResponse<Category[]>>('/categorias');
    return response.data.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.axiosInstance.get<ApiResponse<User[]>>('/usuarios');
    return response.data.data;
  }

  async updateTicketStatus(ticketId: number, status: string): Promise<Ticket> {
    const response = await this.axiosInstance.patch<ApiResponse<Ticket>>(
      `/tickets/${ticketId}/estado`,
      { status }
    );
    return response.data.data;
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }
}

export default new ApiService();
