import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from 'src/app/core/services/evaluacion.service';
import { EvaluacionConPreguntas } from 'src/app/core/models/evaluacion.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { CloudinaryTransformPipe } from 'src/app/shared/pipes/cloudinary-transform.pipe';
import { CanComponentDeactivate } from 'src/app/core/guards/quiz-exit.guard';


@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CloudinaryTransformPipe
  ],
  templateUrl: './quiz-view.component.html',
  styleUrls: ['./quiz-view.component.scss']
})
export class QuizViewComponent implements OnInit, CanComponentDeactivate {

  quiz: EvaluacionConPreguntas | null = null;
  isLoading = true;
  respuestas = new Map<number, number>();
  tiempoSegundos: number = 0; // Contador en segundos
  private timerInterval: any;
  preguntaActualIndex = 0;

  // 🔐 CONTROL DE SALIDA
  isExamFinished = false;

  get preguntaActual() {
    return this.quiz?.preguntas[this.preguntaActualIndex];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluacionService: EvaluacionService,
    private authService: AuthService
  ) {}

ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.evaluacionService.getQuiz(Number(id)).subscribe({
        next: (data) => {
          this.quiz = data;
          this.isLoading = false;

          // ✅ Iniciar cronómetro al cargar el quiz
          this.startTimer();
        },
        error: (err) => {
          console.error('Error al cargar el quiz', err);
          this.isLoading = false;
        }
      });
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.tiempoSegundos++;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

    formatTiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((segundos % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  seleccionarRespuesta(preguntaId: number, opcionId: number): void {
    this.respuestas.set(preguntaId, opcionId);
  }

  siguientePregunta(): void {
    if (this.quiz && this.preguntaActualIndex < this.quiz.preguntas.length - 1) {
      this.preguntaActualIndex++;
    }
  }

  enviarEvaluacion(): void {
    if (!this.quiz) return;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;

    // ✅ Detener cronómetro antes de enviar
    this.stopTimer();

    const payload = {
      id_usuario: userId,
      tiempo_total: this.formatTiempo(this.tiempoSegundos),
      respuestas: Array.from(this.respuestas.entries()).map(
        ([preguntaId, opcionId]) => ({
          id_pregunta: preguntaId,
          id_opcion_seleccionada: opcionId
        })
      )
    };

    this.evaluacionService.submitEvaluacion(this.quiz.id, payload).subscribe({
      next: (resultado) => {
        this.isExamFinished = true; // ✅ Permitir salida

        this.router.navigate(['/resultado', resultado.detalleIntentoId]);
      },
      error: (err) => console.error('Error al enviar la evaluación', err)
    });
  }

  // 🚫 SALIDA ACCIDENTAL
  canDeactivate(): boolean {
    if (this.isExamFinished) return true;

    return window.confirm(
      '¿Estás seguro de que deseas salir? Perderás el progreso de tu evaluación.'
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.isExamFinished) {
      $event.returnValue = true;
    }
  }
}
