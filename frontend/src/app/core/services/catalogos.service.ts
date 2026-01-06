import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  getGrados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grados`);
  }

    registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, data);
  }
}
