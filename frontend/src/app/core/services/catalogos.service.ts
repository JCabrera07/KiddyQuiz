import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private apiUrl = environment.apiUrl; 

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
