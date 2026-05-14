import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `http://localhost:3000`; 

  constructor(private http: HttpClient) {}

  // 1. Obtener preguntas de una evaluación (Usando el endpoint nuevo)
  getQuestionsByEvaluation(evaluacionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evaluacion-pregunta/evaluacion/${evaluacionId}`);
  }

  // 2. Crear una pregunta NUEVA y vincularla automáticamente
  // Nota: Esto asume que tienes un endpoint en 'pregunta' que crea la pregunta
  // y luego llamamos a 'evaluacion-pregunta' para vincularla. 
  // O idealmente, un endpoint "transaccional" en el backend. 
  // Por ahora, simularemos el flujo: Crear Pregunta -> Crear Link.
  
  createQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pregunta`, data);
  }

  linkQuestionToEvaluation(evaluacionId: number, preguntaId: number, orden: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluacion-pregunta`, {
      evaluacionId,
      preguntaId,
      orden
    });
  }

  // 3. Eliminar el VÍNCULO (Quitar pregunta de la evaluación)
  removeQuestionFromEvaluation(idEnlace: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/evaluacion-pregunta/${idEnlace}`);
  }

  // 4. Editar contenido de la pregunta
  updateQuestion(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/pregunta/${id}`, data);
  }

  // Nuevos métodos para los Selects
  getTipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogo/tipos`);
  }

  getDificultades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogo/dificultades`);
  }

  getCompetencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogo/competencias`);
  }
}