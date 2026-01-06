import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ClaseService, ClaseResponse } from 'src/app/core/services/clase.service';

@Component({
  selector: 'app-mis-clases',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './mis-clases.component.html',
  styleUrls: ['./mis-clases.component.scss']
})
export class MisClasesComponent implements OnInit {
  clases: ClaseResponse[] = [];
  loading = true;

  // Imagen por defecto si viene null
  defaultImage = 'assets/images/backgrounds/Paisaje.jpg'; 

  constructor(private claseService: ClaseService) {}

  ngOnInit(): void {
    this.cargarClases();
  }

  cargarClases() {
    this.claseService.getMisClases().subscribe({
      next: (data) => {
        this.clases = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Helper para obtener nombre completo del docente de forma segura
  getDocenteNombre(clase: ClaseResponse): string {
    const persona = clase.docente?.personas?.[0];
    return persona ? `${persona.nombres} ${persona.apellidos}` : 'Sin asignar';
  }
}