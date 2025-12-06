import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/API_CONFIG';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private apiUrl = `${API_CONFIG.predictionApiUrl}/forecast/`;

  constructor(private http: HttpClient) { }

  getByHouse(houseId: number): Observable<any[]> {
    // Em desenvolvimento, usar URL relativa para o proxy funcionar
    // O proxy.conf.json redireciona /forecast/* para http://localhost:8000
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isDevelopment 
      ? `/forecast/${houseId}` 
      : `${this.apiUrl}${houseId}`;
    
    return this.http.get<any[]>(url);
  }
  
}
