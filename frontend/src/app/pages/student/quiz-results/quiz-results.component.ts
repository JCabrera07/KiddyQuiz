import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importante

import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { AuthService } from 'src/app/services/auth.service';
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
  idDetalle: number | null = null; // ID del intento para la IA
  loadingIA = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.resultado = navigation?.extras.state?.['data'];
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idEvaluacion = idParam ? +idParam : null;
    const idUsuario = this.authService.getUserIdFromToken();
  }

  get calificacionNumero(): number {
    return this.resultado ? parseFloat(this.resultado.calificacion) : 0;
  }
}