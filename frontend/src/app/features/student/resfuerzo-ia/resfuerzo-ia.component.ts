import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownPipe } from 'src/app/shared/pipes/markdown.pipe';
import { CompetenciaService } from 'src/app/core/services/competencia.service';

@Component({
  selector: 'app-resfuerzo-ia',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MarkdownPipe,
    RouterLink
  ],
  templateUrl: './resfuerzo-ia.component.html',
  styleUrls: ['./resfuerzo-ia.component.scss']
})
export class ResfuerzoIAComponent implements OnInit {
  comentario: string = '';
  loading = true;
  competenciaNombre: string = '';

  constructor(
    private route: ActivatedRoute,
    private competenciaService: CompetenciaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.comentario = 'ID de competencia no válido';
      this.loading = false;
      return;
    }

    this.competenciaService.getDetalleComentarioIA(id).subscribe({
      next: (res: any) => {
        this.comentario = res.contenidoIA;  // ⚡ Aquí accedemos al campo correcto
        this.competenciaNombre = res.competencia?.nombre || '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener comentario IA', err);
        this.comentario = 'Ocurrió un error al generar el comentario';
        this.loading = false;
      }
    });
  }
}


