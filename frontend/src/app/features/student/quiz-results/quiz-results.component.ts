import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { EvaluacionService } from 'src/app/core/services/evaluacion.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AiFeedbackDialogComponent } from '../ai-feedback-dialog/ai-feedback-dialog.component';

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

  loadingIA = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService,
    private authService: AuthService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.resultado = navigation?.extras.state?.['data'];

    if (this.resultado) {
      this.idDetalle = this.resultado.detalleIntentoId;
    }
  }

  ngOnInit(): void {}

  get calificacionNumero(): number {
    return this.resultado?.calificacion ?? 0;
  }

verComentarioIA() {
  if (!this.idDetalle) {
    console.error("No existe id del detalle");
    return;
  }

  this.loadingIA = true;

  this.evaluacionService.generarComentarioIA(this.idDetalle)
    .subscribe({
      next: (resp: any) => {
        this.loadingIA = false;
        console.log("Comentario generado:", resp);

        this.dialog.open(AiFeedbackDialogComponent, {
          data: { comentario: resp.comentarioIA },
          width: '500px'
        });
      },
      error: (err) => {
        this.loadingIA = false;
        console.error("Error generando comentario IA:", err);
      }
    });
}

}
