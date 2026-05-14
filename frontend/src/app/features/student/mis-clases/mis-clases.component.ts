import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ClaseService, ClaseResponse } from 'src/app/core/services/clase.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { JoinClassDialogComponent } from '../join-class-dialog/join-class-dialog.component';

@Component({
  selector: 'app-mis-clases',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule,MatDialogModule,MatIconModule],
  templateUrl: './mis-clases.component.html',
  styleUrls: ['./mis-clases.component.scss']
})
export class MisClasesComponent implements OnInit {
  clases: ClaseResponse[] = [];
  loading = true;

  // Imagen por defecto si viene null
  defaultImage = 'assets/images/backgrounds/Paisaje.jpg'; 

  constructor(private claseService: ClaseService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarClases();
  }

  cargarClases() {
    this.loading = true;
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
abrirDialogoUnirse() {
    const dialogRef = this.dialog.open(JoinClassDialogComponent, {
      width: '400px',
      panelClass: 'custom-game-modal', // Opcional si quieres quitar padding del mat-dialog-container global
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si result es true, significa que se unió exitosamente
      if (result) {
        this.cargarClases(); // Recargar la lista para ver la nueva clase
      }
    });
  }
  // Helper para obtener nombre completo del docente de forma segura
  getDocenteNombre(clase: ClaseResponse): string {
    const persona = clase.docente?.personas?.[0];
    return persona ? `${persona.nombres} ${persona.apellidos}` : 'Sin asignar';
  }
}