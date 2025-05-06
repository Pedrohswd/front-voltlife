import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { House, HouseUser } from '../model/house';
import { API_CONFIG } from '../config/API_CONFIG';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  
  private apiUrl = `${API_CONFIG.baseUrl}/api/houses`;

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {}

  create(house: House): Observable<House> {
    const userId = this.authService.getUserId()
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<House>(this.apiUrl, house, { params });
  }

  getByUser(): Observable<House[]> {
    const userId = this.authService.getUserId()
    return this.http.get<House[]>(`${this.apiUrl}/user/${userId}`);
  }

  getById(id: number): Observable<House> {
    return this.http.get<House>(`${this.apiUrl}/${id}`);
  }

  update(id: number, house: House): Observable<House> {
    return this.http.put<House>(`${this.apiUrl}/${id}`, house);
  }

  addGuest(houseId: number, email: string): Observable<HouseUser> {
    const params = new HttpParams().set('email', email);
    return this.http.post<HouseUser>(`${this.apiUrl}/${houseId}/add-guest`, null, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
