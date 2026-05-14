import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evaluacion, EvaluacionConPreguntas } from '../models/evaluacion.model'; 
@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  // 
  private apiUrl = `${environment.apiUrl}/evaluacion`; 

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de todas las evaluaciones.
   */
  getEvaluaciones(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.apiUrl);
  }

  /**
   * Obtiene los detalles de una sola evaluación (para la pantalla de pre-entrada).
   */
  getEvaluacion(id: number): Observable<Evaluacion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Evaluacion>(url);
  }

  // Crear (Usa FormData para imagen + datos)
  crearEvaluacion(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Editar
  editarEvaluacion(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar
  eliminarEvaluacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  /**
   * Obtiene la evaluación completa con sus preguntas y opciones para iniciar el quiz.
   * NOTA: Requiere un endpoint en tu backend como /api/evaluaciones/:id/quiz
   */
  getQuiz(id: number): Observable<EvaluacionConPreguntas> {
    const url = `${this.apiUrl}/${id}/quiz`;
    return this.http.get<EvaluacionConPreguntas>(url);
  }

  /**
   * Envía las respuestas del usuario para que el backend las califique.
   */
  submitEvaluacion(id: number, respuestas: any): Observable<any> {
    const url = `${this.apiUrl}/${id}/submit`;
    return this.http.post(url, respuestas);
  }

getDetalleEvaluacion(id: number): Observable<any> {
  return this.http.get(`${environment.apiUrl}/detalle-evaluacion/${id}`);
}


  generarComentarioIA(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/detalle-evaluacion/${id}/comentario-ia`, {});
  }

  getDetalleconRespuestas(id: number): Observable<any> {
  return this.http.get(`${environment.apiUrl}/detalle-evaluacion/${id}/respuestas`);
}

// Agrega esto en tu EvaluacionService
generarComentarioCortoIA(idDetalle: number) {
  // Llama a tu nuevo endpoint PATCH
  return this.http.patch(`${environment.apiUrl}/detalle-evaluacion/${idDetalle}/comentario-ia-corto`, {});
}



}
