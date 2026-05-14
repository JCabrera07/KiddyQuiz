import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Grado {
  id: number;
  nombre: string;
}

export interface Competencia {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string | null;
  grado?: Grado;
  idGrado: number;
}


@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {
  private apiUrl = 'http://localhost:3000/competencia';

  constructor(private http: HttpClient) {}

getCompetenciasByGrado(idGrado: number): Observable<Competencia[]> {
  return this.http.get<Competencia[]>(`${this.apiUrl}?grado=${idGrado}`);
}

  getDetalleComentarioIA(id: number): Observable<any> {
  return this.http.get(`http://localhost:3000/competencia/${id}/contenido-ia`);
}

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}
