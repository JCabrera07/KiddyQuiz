import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Para poder navegar al hacer click
import { MatCardModule } from '@angular/material/card'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CompetenciaService, Competencia } from 'src/app/core/services/competencia.service';
import { ProgresoService } from 'src/app/core/services/progreso.service'; // Asegúrate de importar este servicio

// Interfaz para combinar datos de BD + Progreso visual
interface CompetenciaVisual extends Competencia {
  porcentaje: number;
  logrado: boolean;
}

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.scss']
})
export class StudentProgressComponent implements OnInit {

  competenciasConProgreso: CompetenciaVisual[] = [];
  isLoading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private competenciaService: CompetenciaService,
    private progresoService: ProgresoService // Inyectamos el servicio que conecta con tu backend
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.isLoading = false;
      return;
    }

    // 1. Obtener el grado del estudiante
    this.userService.getUserProfile(userId).subscribe({
      next: (user) => {
        // Ajusta según la estructura real de tu respuesta de usuario
        const idGrado = user.persona?.[0]?.id_grado; 
        
        if (!idGrado) {
          console.error('El idGrado del usuario no está definido');
          this.isLoading = false;
          return;
        }
        
        // 2. Cargar datos reales
        this.cargarDatosCombinados(idGrado, userId);
      },
      error: (err) => {
        console.error('Error al obtener usuario', err);
        this.isLoading = false;
      }
    });
  }

  cargarDatosCombinados(idGrado: number, userId: number) {
    // A. Obtener Competencias del grado
    this.competenciaService.getCompetenciasByGrado(idGrado).subscribe({
      next: (competencias) => {
        
        // B. Obtener Progreso REAL de la base de datos
        this.progresoService.obtenerProgresoEstudiante(userId).subscribe({
          next: (progresos) => {
            
            // C. FUSIONAR: Mapeamos competencias con su progreso correspondiente
            this.competenciasConProgreso = competencias.map(comp => {
              // Buscamos si existe un registro de progreso para esta competencia
              // Nota: Revisa que tu backend devuelva la relación 'competencia' poblada
              const prog = progresos.find((p: any) => p.competencia?.id === comp.id);
              
              return {
                ...comp,
                // Si existe, usamos los datos de la BD. Si no, asumimos 0%.
                porcentaje: prog ? Number(prog.porcentaje) : 0,
                logrado: prog ? prog.logrado : false
              };
            });
            
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando progresos', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error cargando competencias', err);
        this.isLoading = false;
      }
    });
  }
}


