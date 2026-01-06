import { Component, ViewEncapsulation } from '@angular/core'; // Importar ViewEncapsulation
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './change-password-dialog.component.html',
  encapsulation: ViewEncapsulation.None, // <--- ESTO FUERZA LOS ESTILOS
  styles: [`
    /* Contenedor principal del formulario */
    .password-form {
      display: flex;
      flex-direction: column; /* Apila los elementos verticalmente */
      width: 100%;
      padding-top: 10px;
      gap: 16px; /* Espacio entre campos */
    }

    /* Forzamos a cada campo a ocupar todo el ancho disponible */
    .password-form mat-form-field {
      width: 100%;
      display: block;
    }
    
    /* Aseguramos que el input dentro del mat-form-field también se estire */
    .password-form mat-form-field .mat-form-field-wrapper {
      width: 100%;
    }
  `]
})
export class ChangePasswordDialogComponent {
  
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  guardar() {
    if (this.form.invalid) return;

    this.loading = true;
    const { oldPassword, newPassword } = this.form.value;
    const payload = { oldPassword, newPassword };

    this.userService.changePassword(payload).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada con éxito', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error cambiando password', err);
        let msg = 'Error al cambiar la contraseña';
        if (err.status === 400 || err.status === 401) {
          msg = 'La contraseña actual es incorrecta';
        }
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}