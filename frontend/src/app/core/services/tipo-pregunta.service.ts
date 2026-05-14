import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TipoPreguntaService {
  private apiUrl = `${environment.apiUrl}/tipo-pregunta`;

  constructor(private http: HttpClient) {}

findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}