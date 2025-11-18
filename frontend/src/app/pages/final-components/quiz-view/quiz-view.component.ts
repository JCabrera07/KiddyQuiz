import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { EvaluacionConPreguntas } from 'src/app/models/evaluacion.model';
// Importa los módulos necesarios para tu vista
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { CloudinaryTransformPipe } from 'src/app/pipe/cloudinary-transform.pipe';


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
export class QuizViewComponent implements OnInit {
  
   quiz: EvaluacionConPreguntas | null = null;
  isLoading = true;
  respuestas = new Map<number, number>();

  // --- NUEVAS PROPIEDADES ---
  preguntaActualIndex = 0; // Índice para saber en qué pregunta estamos (empieza en 0)

  // Getter para acceder fácilmente a la pregunta actual en el HTML
  get preguntaActual() {
    return this.quiz?.preguntas[this.preguntaActualIndex];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inyectamos el Router para navegar al final
    private evaluacionService: EvaluacionService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Usamos el método getQuiz que trae la evaluación con preguntas
      this.evaluacionService.getQuiz(Number(id)).subscribe({
        next: (data) => {
          this.quiz = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error al cargar el quiz", err);
          this.isLoading = false;
        }
      });
    }
  }

  // Se llama cada vez que el usuario selecciona una opción
  seleccionarRespuesta(preguntaId: number, opcionId: number): void {
    this.respuestas.set(preguntaId, opcionId);
  }

    // --- NUEVO MÉTODO ---
  siguientePregunta(): void {
    // Verificamos que no estemos en la última pregunta
    if (this.quiz && this.preguntaActualIndex < this.quiz.preguntas.length - 1) {
      this.preguntaActualIndex++; // Avanzamos al siguiente índice
    }
  }
  // --- FIN DE NUEVO MÉTODO ---

  // Se llama al enviar el formulario
 enviarEvaluacion(): void {
    if (!this.quiz) return;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      console.error("No se pudo obtener el ID del usuario. El usuario no está autenticado.");
      return; // Detiene la ejecución si no hay ID
    }

    const payload = {
      // El DTO del backend todavía espera 'id_usuario', pero lo ignoraremos por seguridad
      id_usuario: userId, 
      tiempo_total: "00:10:00",
      respuestas: Array.from(this.respuestas.entries()).map(([preguntaId, opcionId]) => ({
        id_pregunta: preguntaId,
        id_opcion_seleccionada: opcionId
      }))
    };

    this.evaluacionService.submitEvaluacion(this.quiz.id, payload).subscribe({
      next: (resultado) => {
        console.log("Evaluación enviada con éxito", resultado);
        this.router.navigate(
        ['/resultado', resultado.detalleIntentoId], // La URL (ej: /resultado/15)
        { 
          state: { data: resultado } // Los datos que enviamos
        }
      );
      },
      error: (err) => console.error("Error al enviar la evaluación", err)
    });
  }
}