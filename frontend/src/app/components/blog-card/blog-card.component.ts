import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Evaluacion } from 'src/app/models/evaluacion.model';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { DatePipe } from '@angular/common';
<<<<<<< HEAD
import { RouterLink } from '@angular/router';
=======
>>>>>>> dae56bda09222a7943d6f2bed32053550878ec49

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    TablerIconsModule,
    MatButtonModule,
<<<<<<< HEAD
    DatePipe,
    RouterLink
  ],
  templateUrl: './blog-card.component.html',
  // AÑADE LOS NUEVOS ESTILOS AQUÍ
  styles: [`
    .card-img-fixed {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 8px;
    }

    /* --- ESTILOS NUEVOS --- */

    /* 1. Estilos para la tarjeta clickeable y la animación */
    .clickable-card {
      cursor: pointer;
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

    .clickable-card:hover {
      transform: scale(1.05); /* Efecto de zoom del 5% */
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada */
    }

    /* 2. Estilos para el enlace invisible que cubre la tarjeta */
    .stretched-link::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1; /* Se asegura de que esté por encima del contenido */
      content: "";
=======
    DatePipe
  ],
  templateUrl: './blog-card.component.html',
  styles: [`
    .card-img-fixed {
      width: 100%;
      height: 250px;       /* 👈 altura fija */
      object-fit: cover;   /* 👈 recorta sin deformar */
      border-radius: 8px;  /* opcional */
>>>>>>> dae56bda09222a7943d6f2bed32053550878ec49
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


