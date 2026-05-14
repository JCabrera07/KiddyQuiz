import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// Definimos la interfaz EXACTA de lo que devuelve tu Backend
export interface DashboardResponse {
  kpis: {
    totalEstudiantes: number;
    clasesActivas: number;
    promedioGeneral: string; // Viene como string "8.50" del toFixed(2)
    evaluacionesPendientes: number;
  };
  rendimientoPorClase: {
    clase: string;
    promedio: number;
  }[];
  estadoEstudiantes: {
    aprobados: number;
    riesgo: number;
    reprobados: number;
  };
  estudiantesEnRiesgo: {
    id: number;
    nombre: string;
    clase: string;
    promedio: number;
    estado: string; // "Crítico" o "Riesgo"
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `http://localhost:3000/analytics`; 

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/dashboard`);
  }
}