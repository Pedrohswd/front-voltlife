import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {Router} from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtResponse } from '../model/auth';
import { API_CONFIG } from '../config/API_CONFIG';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${API_CONFIG.baseUrl}/authenticate`;
  private currentUserSubject = new BehaviorSubject<JwtResponse | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // Recupera o token do localStorage ao iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUser(): JwtResponse | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser?.token;
  }

  get authToken(): string | null {
    return this.currentUser?.token ?? null;
  }
  
  login(email: string, password: string): Observable<JwtResponse> {
    const body = {email,password}
    
    return this.http
    .post<JwtResponse>(this.apiUrl,body)  
    .pipe(
      tap((response) => {
        // Verifica se a resposta é válida
        if (!response || !response.token) {
          throw new Error('Resposta inválida do servidor');
        }

        // Armazena os dados do usuário no localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('token', JSON.stringify(response.token));
        this.currentUserSubject.next(response);

        // Redireciona para a página inicial ou outra página após o login bem-sucedido
        this.router.navigate(['/home']);
      }),
      catchError((error) => {
        // Lidar com erro no login
        if (error.status === 401) {
          console.error('Credenciais inválidas:', error);
          alert('Usuário ou senha incorretos.');
        } else if (error.status === 0) {
          console.error('Erro de conexão:', error);
          alert('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else if (error instanceof Error) {
          console.error('Erro na resposta do servidor:', error.message);
          alert(`Erro inesperado: ${error.message}`);
        } else {
          console.error('Erro desconhecido:', error);
          alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
        return throwError(() => error); // Propaga o erro para ser tratado no componente, se necessário
      })
    );
  }

  
  // Realiza o logout do usuário
  logout(): void {
    // Limpa os dados armazenados
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token')
    this.currentUserSubject.next(null);
    // Redireciona para a página de login após logout
    this.router.navigate(['/auth/login']);
  }

  // Verifica se o usuário tem uma role específica
  hasRole(role: string): boolean {
    const token = this.authToken;
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token); // Decodifica o JWT
      const roles = decoded.roles || [];
      return roles.includes(role);
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
      return false;
    }
  }
  getUserId(): any{
    const token = this.authToken;
    
    if (!token) return "GUEST";

    try {
      const decoded: any = jwtDecode(token); // Decodifica o JWT
      const username = decoded.jti;
      return username;
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
    }
  }
  getUsername(): any {
    const token = this.authToken;
    if (!token) return "GUEST";
    
    try {
      const decoded: any = jwtDecode(token); // Decodifica o JWT
      const username = decoded.sub;
      return username;
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
    }
  }

  getUserRole(): any {

    const token = this.authToken;
    if (!token) return "GUEST";
    try {
      const decoded: any = jwtDecode(token); // Decodifica o JWT
      const roles = decoded.roles || [];
      return roles;
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
    }
  }

  // Verifica se o token está expirado
  isTokenExpired(): boolean {
    const token = this.authToken;
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Função para adicionar o token no cabeçalho das requisições HTTP
  private addAuthorizationHeader(): HttpHeaders {
    const token = this.authToken;
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  // Exemplo de requisição protegida com token
  getUserProfile(): Observable<any> {
    const headers = this.addAuthorizationHeader();
    return this.http.get<any>('http://localhost:8080/profile', { headers });
  }
}
