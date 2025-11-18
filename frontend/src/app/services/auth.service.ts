import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth'; 

  // --- CORRECCIÓN AQUÍ ---
  // Inyectamos el Router además del HttpClient
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Realiza el login y GUARDA el token en localStorage si la petición es exitosa.
   */
  login(username: string, password: string): Observable<{ access_token: string }> {
    const body = { username, password };
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      })
    );
  }
  
  /**
   * Obtiene el token guardado en localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Decodifica el token guardado para obtener el ID del usuario ('sub').
   */
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: { username: string, sub: number } = jwtDecode(token);
        return decodedToken.sub;
      } catch (error) {
        console.error("Error decodificando el token", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Cierra sesión eliminando el token y redirigiendo.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    console.log('Sesión cerrada y token eliminado.');
    
    // Ahora 'this.router' existirá y esta línea funcionará
    this.router.navigate(['/']);
  }
}