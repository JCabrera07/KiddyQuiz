import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
// Asegúrate de que la ruta al modelo sea correcta y que el archivo contenga todas las interfaces.
import { Evaluacion, EvaluacionConPreguntas } from '../models/evaluacion.model'; 
@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  // Corregí la URL base para que apunte al controlador correcto de tu API
  private apiUrl = 'http://localhost:3000/evaluacion'; 

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

    generarComentarioIA(idDetalle: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/detalle-evaluacion/${idDetalle}/comentario-ia`, {});
  }

}
