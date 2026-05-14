import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProgresoService {
  private apiUrl = `${environment.apiUrl}/progreso-competencia`;

  constructor(private http: HttpClient) {}

  actualizarProgreso(data: {
    estudianteId: number;
    competenciaId: number;
    totalPreguntas: number;
    preguntasCorrectas: number;
    detalleEvaluacionId?: number;
  }) {
    return this.http.post(`${this.apiUrl}/actualizar`, data);
  }
  obtenerProgresoEstudiante(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estudiante/${userId}`);
  }
}