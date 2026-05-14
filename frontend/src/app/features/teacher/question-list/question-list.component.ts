import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionService } from 'src/app/core/services/question.service';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { OptionManagerComponent } from '../option-manager/option-manager.component';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatDialogModule, MatSnackBarModule,
    MatButtonModule, MatIconModule, MatCardModule, MatExpansionModule, MatChipsModule
  ],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  evaluacionId: number = 0;
  preguntas: any[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Obtener ID de la URL. Asumimos ruta: /teacher/evaluacion/:id/preguntas
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.evaluacionId = +idParam;
      this.cargarPreguntas();
    }
  }

  cargarPreguntas() {
    this.cargando = true;
    this.questionService.getQuestionsByEvaluation(this.evaluacionId).subscribe({
      next: (data) => {
        // La data viene como EvaluacionPregunta (el enlace), dentro tiene 'pregunta'
        this.preguntas = data; 
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.snackBar.open('Error al cargar preguntas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  crearPregunta() {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'dialog-empresarial',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 1. Crear Pregunta
        this.questionService.createQuestion(result).subscribe({
          next: (nuevaPregunta) => {
            // 2. Vincular a la Evaluación
            const orden = this.preguntas.length + 1;
            this.questionService.linkQuestionToEvaluation(this.evaluacionId, nuevaPregunta.id, orden).subscribe({
              next: () => {
                this.snackBar.open('Pregunta agregada', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
                this.cargarPreguntas();
              }
            });
          },
          error: () => this.snackBar.open('Error al crear pregunta', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  editarPregunta(itemEnlace: any) {
    // itemEnlace es el objeto EvaluacionPregunta, itemEnlace.pregunta es la data real
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'dialog-empresarial',
      disableClose: true,
      data: { pregunta: itemEnlace.pregunta }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questionService.updateQuestion(itemEnlace.pregunta.id, result).subscribe({
          next: () => {
            this.snackBar.open('Pregunta actualizada', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
            this.cargarPreguntas();
          },
          error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  eliminarPregunta(itemEnlace: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Quitar Pregunta',
        mensaje: '¿Estás seguro de quitar esta pregunta de la evaluación? (La pregunta no se borra del banco)',
        textoBoton: 'Sí, Quitar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        // Eliminamos el enlace (EvaluacionPregunta) usando su ID
        this.questionService.removeQuestionFromEvaluation(itemEnlace.id).subscribe({
          next: () => {
            this.snackBar.open('Pregunta removida', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
            this.cargarPreguntas();
          },
          error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  volver() {
    // Volver a la lista de evaluaciones. Ajusta la ruta si es necesario.
    // Necesitamos el ID de la clase para volver correctamente si tu ruta es /clase/:id/evaluaciones
    // Por ahora, un history back simple puede servir o navegar a la ruta padre
    window.history.back(); 
  }

  gestionarOpciones(pregunta: any) {
  this.dialog.open(OptionManagerComponent, {
    width: '600px',
    panelClass: 'dialog-empresarial',
    data: { pregunta: pregunta }
  });
}
}
