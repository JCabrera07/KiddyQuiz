import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DificultadService {
  // Ajusta la ruta si decidiste usar otra, pero esta coincide con el PreguntaController
  private apiUrl = `http://localhost:3000/dificultad`;

  constructor(private http: HttpClient) {}

findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}