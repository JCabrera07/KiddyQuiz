import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-evaluacion-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './evaluacion-detail.component.html',
  styleUrls: ['./evaluacion-detail.component.scss']
})
export class EvaluacionDetailComponent implements OnInit {
  evaluacion: Evaluacion | null = null;
  isLoading = true;
  evaluacionId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.evaluacionId = Number(id);
      this.evaluacionService.getEvaluacion(this.evaluacionId).subscribe({
        next: (data) => {
          this.evaluacion = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar detalle de evaluación', err);
          this.isLoading = false;
        }
      });
    }
  }
}