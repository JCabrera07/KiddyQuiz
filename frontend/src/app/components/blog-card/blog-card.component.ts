import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    TablerIconsModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './blog-card.component.html',
  styles: [`
    .card-img-fixed {
      width: 100%;
      height: 250px;       /* 👈 altura fija */
      object-fit: cover;   /* 👈 recorta sin deformar */
      border-radius: 8px;  /* opcional */
    }
  `]
})
export class AppBlogCardsComponent implements OnInit {
  evaluaciones: Evaluacion[] = [];

  constructor(private evaluacionService: EvaluacionService) {}

  ngOnInit(): void {
    this.evaluacionService.getEvaluaciones().subscribe({
      next: (data) => {
        this.evaluaciones = data;
      },
      error: (err) => {
        console.error('Error cargando evaluaciones:', err);
      }
    });
  }
}


