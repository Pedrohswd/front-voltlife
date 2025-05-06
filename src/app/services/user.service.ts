import { Injectable } from '@angular/core';
import { User, UserRegistration } from '../model/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/API_CONFIG';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${API_CONFIG.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  // Buscar todos os usuários (para ADMIN e MANAGER)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  // Registrar novo usuário
  register(user: UserRegistration): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  // Buscar usuário por ID
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${username}`);
  }

  // Atualizar usuário
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Ativar/Desativar usuário (apenas ADMIN)
  toggleUserStatus(user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/toggle-status`, user);
  }

  // Buscar perfil do usuário logado
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  // Alterar senha
  changePassword(id: number, passwords: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/change-password`, passwords);
  }

  // Verificar se email já existe
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`);
  }

  // Buscar usuários com paginação e filtros
  getUsers(params: {
    page: number;
    size: number;
    sort?: string;
    role?: string;
    active?: boolean;
    search?: string;
  }): Observable<{
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/search?${queryParams.toString()}`);
  }
}
