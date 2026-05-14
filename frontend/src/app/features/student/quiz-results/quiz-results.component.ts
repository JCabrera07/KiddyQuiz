import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EvaluacionService } from 'src/app/core/services/evaluacion.service';
import { AiFeedbackDialogComponent } from '../ai-feedback-dialog/ai-feedback-dialog.component';
import { ProgresoService } from 'src/app/core/services/progreso.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {

  resultado: any;
  comentarioIA: string | null = null;
  idDetalle: number | null = null;
  
  // NUEVA VARIABLE PARA EL COMENTARIO CORTO
  comentarioCorto: string | null = null; 
  loadingCorto = false; // Para mostrar un mini loader si tarda

  loadingIA = false;

  // 🔹 MÉTRICAS
  respuestasCorrectas = 0;
  respuestasIncorrectas = 0;
  totalPreguntas = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService,
    private dialog: MatDialog,
    private authService: AuthService,
    private progresoService: ProgresoService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.resultado = navigation?.extras.state?.['data'];

    if (this.resultado) {
      this.idDetalle = this.resultado.detalleIntentoId;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('No se recibió id del detalle');
      return;
    }

    this.idDetalle = +id;

    // 🔹 1. Cargar detalle básico
    this.evaluacionService.getDetalleEvaluacion(this.idDetalle)
      .subscribe({
        next: (data) => {
          this.resultado = data;
          
          // Si ya existe un comentario guardado previamente, úsalo (opcional)
          // Si no, generamos uno nuevo corto
          this.obtenerComentarioCorto(); 
        },
        error: (err) => {
          console.error('Error cargando resultado:', err);
        }
      });

    // 🔹 2. Cargar respuestas para métricas
    this.cargarMetricas();
  }

  // NUEVO MÉTODO PARA CONSUMIR TU ENDPOINT
  obtenerComentarioCorto() {
    if (!this.idDetalle) return;
    
    this.loadingCorto = true;
    
    this.evaluacionService.generarComentarioCortoIA(this.idDetalle).subscribe({
      next: (resp: any) => {
        // Asumimos que tu backend devuelve { comentarioIA: "..." }
        this.comentarioCorto = resp.comentarioIA;
        this.loadingCorto = false;
      },
      error: (err) => {
        console.error('Error obteniendo feedback corto', err);
        this.loadingCorto = false;
      }
    });
  }

  // ===============================
  // MÉTRICAS
  // ===============================
  cargarMetricas(): void {
    if (!this.idDetalle) return;

    this.evaluacionService
      .getDetalleconRespuestas(this.idDetalle)
      .subscribe({
        next: (data: any) => {
          const respuestas = data.respuestas || [];

          this.totalPreguntas = respuestas.length;
          this.respuestasCorrectas = respuestas.filter((r: any) => r.esCorrecta).length;
          this.respuestasIncorrectas =
            this.totalPreguntas - this.respuestasCorrectas;

          this.resultado = {
            ...this.resultado,
            respuestasCorrectas: this.respuestasCorrectas,
            totalPreguntas: this.totalPreguntas
          };
          this.actualizarProgresoCompetencias(respuestas);
        },
        error: (err) => {
          console.error('Error cargando métricas:', err);
        }
      });
  }

  private actualizarProgresoCompetencias(respuestas: any[]) {
    const estudianteId = this.authService.getUserIdFromToken();
    if (!estudianteId) return;

    const competenciasMap = new Map<number, { total: number, correctas: number }>();

    respuestas.forEach((r: any) => {
      const compId = r.pregunta?.competencia?.id;
      
      if (compId) {
        const actual = competenciasMap.get(compId) || { total: 0, correctas: 0 };
        
        actual.total++;
        if (r.esCorrecta) {
          actual.correctas++;
        }
        
        competenciasMap.set(compId, actual);
      }
    });
    
    competenciasMap.forEach((datos, compId) => {
      this.progresoService.actualizarProgreso({
        estudianteId: estudianteId,
        competenciaId: compId,
        totalPreguntas: datos.total,
        preguntasCorrectas: datos.correctas,
        detalleEvaluacionId: this.idDetalle || undefined
      }).subscribe({
        next: (res) => console.log(`Progreso actualizado para competencia ${compId}`, res),
        error: (err) => console.error(`Error actualizando competencia ${compId}`, err)
      });
    });
  }

  get calificacionNumero(): number {
    return Number(this.resultado?.calificacion ?? 0);
  }

  verComentarioIA() {
    if (!this.idDetalle) {
      console.error('No existe id del detalle');
      return;
    }

    this.loadingIA = true;

    this.evaluacionService.generarComentarioIA(this.idDetalle)
      .subscribe({
        next: (resp: any) => {
          this.loadingIA = false;

          this.dialog.open(AiFeedbackDialogComponent, {
            data: { comentario: resp.comentarioIA },
            width: '500px'
          });
        },
        error: (err) => {
          this.loadingIA = false;
          console.error('Error generando comentario IA:', err);
        }
      });
  }
}

