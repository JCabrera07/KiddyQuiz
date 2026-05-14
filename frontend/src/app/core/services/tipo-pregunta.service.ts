import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TipoPreguntaService {
  private apiUrl = `http://localhost:3000/tipo-pregunta`;

  constructor(private http: HttpClient) {}

findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}