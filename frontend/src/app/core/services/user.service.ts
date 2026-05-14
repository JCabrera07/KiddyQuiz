import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/core/models/user-profile.model';
import { AuthService } from './auth.service'; 
import { environment } from '../../../environments/environment';

export interface UsuarioBackend {
  id: number;
  username: string;
  persona: {
    nombres: string;
    apellidos: string;
    edad: number;
    ciudad: string;
    sexo: string;
    rol: string;
    grado: string;
    id_grado?: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  
  // Ajusta el puerto según tu backend
  private apiUrl = `${environment.apiUrl}/usuario`; 

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

getAllUsers(): Observable<UsuarioBackend[]> {
    return this.http.get<UsuarioBackend[]>(this.apiUrl);
  }

  // src/app/core/services/user.service.ts

getMyStudents(): Observable<UsuarioBackend[]> {
  // Llamamos al nuevo endpoint filtrado
  return this.http.get<UsuarioBackend[]>(`${this.apiUrl}/mis-estudiantes`);
}
}