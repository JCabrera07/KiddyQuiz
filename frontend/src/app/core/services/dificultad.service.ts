import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DificultadService {
  // Ajusta la ruta si decidiste usar otra, pero esta coincide con el PreguntaController
  private apiUrl = `${environment.apiUrl}/dificultad`;

  constructor(private http: HttpClient) {}

findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}