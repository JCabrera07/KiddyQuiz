import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips'; // Para badge de correcta

import { OptionService } from 'src/app/core/services/option.service';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-option-manager',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, 
    MatIconModule, MatChipsModule
  ],
  templateUrl: './option-manager.component.html',
  styleUrls: ['./option-manager.component.scss']
})
export class OptionManagerComponent implements OnInit {
  
  opciones: any[] = [];
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<OptionManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // data.pregunta (objeto completo)
    private optionService: OptionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarOpciones();
  }

  cargarOpciones() {
    this.loading = true;
    this.optionService.getOptionsByQuestion(this.data.pregunta.id).subscribe({
      next: (res) => {
        this.opciones = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  crearOpcion() {
    const dialogRef = this.dialog.open(OptionDialogComponent, {
            width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      data: { preguntaId: this.data.pregunta.id } // Pasamos el ID para crear
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.optionService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Opción creada', 'Cerrar', { duration: 3000 });
            this.cargarOpciones();
          },
          error: () => this.snackBar.open('Error al crear', 'Cerrar')
        });
      }
    });
  }

  editarOpcion(opcion: any) {
    const dialogRef = this.dialog.open(OptionDialogComponent, {
            width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      data: { 
        preguntaId: this.data.pregunta.id,
        opcion: opcion 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.optionService.update(opcion.id, result).subscribe({
          next: () => {
            this.snackBar.open('Opción actualizada', 'Cerrar', { duration: 3000 });
            this.cargarOpciones();
          },
          error: () => this.snackBar.open('Error al actualizar', 'Cerrar')
        });
      }
    });
  }

  eliminarOpcion(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { titulo: 'Eliminar Opción', mensaje: '¿Seguro que deseas eliminar esta opción?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.optionService.delete(id).subscribe({
          next: () => {
             this.snackBar.open('Eliminado', 'Cerrar', { duration: 2000 });
             this.cargarOpciones();
          }
        });
      }
    });
  }

  cerrar() { this.dialogRef.close(); }
}
