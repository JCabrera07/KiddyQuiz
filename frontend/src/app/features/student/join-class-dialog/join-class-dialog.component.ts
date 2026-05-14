import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClaseService } from 'src/app/core/services/clase.service';

@Component({
  selector: 'app-join-class-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './join-class-dialog.component.html',
  styleUrls: ['./join-class-dialog.component.scss']
})
export class JoinClassDialogComponent {
  joinForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JoinClassDialogComponent>,
    private claseService: ClaseService,
    private snackBar: MatSnackBar
  ) {
    this.joinForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  unirse() {
    if (this.joinForm.valid) {
      this.loading = true;
      const codigo = this.joinForm.value.codigo;

      this.claseService.unirseAClase(codigo).subscribe({
        next: (res) => {
          this.loading = false;
          // Feedback divertido
          this.snackBar.open('¡Misión Cumplida! Te has unido a la clase 🚀', 'Genial', {
            duration: 3000,
            panelClass: 'success-snackbar',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true); // Retorna true para recargar la lista
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          let msg = 'El código no es válido o ya estás dentro 💀';
          if (err.error && err.error.message) msg = err.error.message;
          
          this.snackBar.open(msg, 'Intentar de nuevo', {
            duration: 4000,
            panelClass: 'error-snackbar',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
