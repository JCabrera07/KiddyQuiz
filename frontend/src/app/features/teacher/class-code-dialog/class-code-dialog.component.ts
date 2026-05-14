import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-class-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './class-code-dialog.component.html',
  styleUrls: ['./class-code-dialog.component.scss']
})
export class ClassCodeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ClassCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codigo: string; nombre: string },
    private snackBar: MatSnackBar
  ) {}

  copiarCodigo() {
    navigator.clipboard.writeText(this.data.codigo).then(() => {
      this.snackBar.open('¡Código copiado al portapapeles!', 'Cerrar', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'success-snackbar' // Asegúrate de tener esta clase o usa la default
      });
    }).catch(err => {
      console.error('Error al copiar', err);
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
