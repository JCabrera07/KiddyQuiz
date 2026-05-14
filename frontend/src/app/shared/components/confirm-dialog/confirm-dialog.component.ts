import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Opcional

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="color: #d32f2f;">
      <mat-icon style="vertical-align: middle; margin-right: 8px;">warning</mat-icon>
      {{ data.titulo || 'Confirmar acción' }}
    </h2>
    <mat-dialog-content>
      <p style="font-size: 1rem; color: #546e7a;">
        {{ data.mensaje || '¿Estás seguro de realizar esta acción?' }}
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-flat-button color="warn" (click)="confirmar()">
        {{ data.textoBoton || 'Eliminar' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancelar() { this.dialogRef.close(false); }
  confirmar() { this.dialogRef.close(true); }
}
