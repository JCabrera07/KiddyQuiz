import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 1. Importar HttpHeaders
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { AuthService } from './auth.service'; // 2. Importar AuthService

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // Ajusta el puerto según tu backend
  private apiUrl = 'http://localhost:3000/usuario'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService // 3. Inyectar AuthService
  ) {}

  // Helper privado para crear las cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Formato estándar JWT
    });
  }

  getUserProfile(id: number): Observable<UserProfile> {
    // GET suele ser público o protegido, por seguridad enviamos el token también
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateProfile(id: number, data: any): Observable<any> {
    // 4. Enviamos las cabeceras (headers) en la petición PATCH
    return this.http.patch(`${this.apiUrl}/${id}`, data, { 
      headers: this.getHeaders() 
    });
  }

    // --- NUEVO MÉTODO ---
  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data, { 
      headers: this.getHeaders() 
    });
  }
}