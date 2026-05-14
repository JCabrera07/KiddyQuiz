import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoContenidoService {
  // Nota: Asegúrate de agregar este endpoint en el backend si no lo has hecho
  private apiUrl = `http://localhost:3000/tipo-contenido`;

  constructor(private http: HttpClient) {}

findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}