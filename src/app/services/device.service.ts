import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../model/device';
import { API_CONFIG } from '../config/API_CONFIG';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${API_CONFIG.baseUrl}/api/devices`;

  constructor(private http: HttpClient) {}

  getByHouse(houseId: number): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/house/${houseId}`);
  }

  getById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  create(device: Device, houseId: number): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}?houseId=${houseId}`, device);
  }

  update(id: number, device: Device): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
