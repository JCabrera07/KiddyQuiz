import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Servicios e Interfaces
import { ClaseService, ClaseResponse } from 'src/app/core/services/clase.service';

// Angular Material Imports (Igual que en tables.component.ts)
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Para efecto de carga

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'] // Asumo que tienes estilos base o Tailwind
})
export class ClassComponent implements OnInit {

  // Definición de columnas para la tabla de Material
  displayedColumns: string[] = ['img', 'asignatura', 'grado', 'fecha', 'acciones'];
  
  clases: ClaseResponse[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private claseService: ClaseService) {}

  ngOnInit(): void {
    this.listarClasesDocente();
  }

listarClasesDocente(): void {
  this.cargando = true;
  this.claseService.getMisClasesDocente().subscribe({
    next: (res) => {
      console.log('Clases recibidas:', res);
      this.clases = res;
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error cargando clases', err);
      this.error = 'No se pudieron cargar las clases';
      this.cargando = false;
    }
  });
}


  // Helper para formatear nombres (usado en el HTML)
getNombresDocente(docente: any): string {
  if (!docente) return 'Sin asignar';
  if (docente.nombres && docente.apellidos) return `${docente.nombres} ${docente.apellidos}`;
  if (docente.personas?.length) return docente.personas.map((p: any) => `${p.nombres} ${p.apellidos}`).join(', ');
  return 'Sin asignar';
}

crearClase() {

  console.log('Crear Clase clickeado');
}

}
