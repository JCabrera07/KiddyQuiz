import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

// Definimos la interfaz aquí para mantener el tipado ordenado
export interface ClaseResponse {
  id: number;
  nombre: string;
  imagenUrl?: string;
  createdAt: string;
  
  // CORRECCIÓN: Añadimos '?' porque puede venir null de la base de datos
  grado?: { 
    nombre: string;
  };

  // También es buena práctica hacerlo aquí por si acaso
  docente?: { 
    personas: Array<{
      nombres: string;
      apellidos: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  // Ajusta la URL si tu entorno cambia
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

getMisClases(): Observable<ClaseResponse[]> {
  return this.http
    .get<ClaseResponse[]>(`${this.apiUrl}/clase/estudiante/mis-clases`)
    .pipe(
      catchError((error) => {
        console.error('Error obteniendo clases', error);
        return of([]);
      })
    );
}

  // Clases del docente
// Clases del docente
getMisClasesDocente(): Observable<ClaseResponse[]> {
  return this.http.get<ClaseResponse[]>(`${this.apiUrl}/clase/docente/mis-clases`)
    .pipe(
      catchError((error) => {
        console.error('Error obteniendo clases del docente', error);
        return of([]);
      })
    );
}


  obtenerEvaluaciones(idClase: number) {
    return this.http.get<any[]>(`${this.apiUrl}/clase/${idClase}/evaluaciones`);
  }

}