import { Component, Inject } from '@angular/core'; // Inyectamos MAT_DIALOG_DATA
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
  // Conectamos el archivo SCSS y quitamos estilos inline y ViewEncapsulation
  styleUrls: ['./change-password-dialog.component.scss'] 
})
export class ChangePasswordDialogComponent {
  
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibimos datos
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Getter para saber si es estudiante
  get isStudent(): boolean {
    return this.data?.isStudent === true;
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
        const msg = this.isStudent ? '¡Llave secreta actualizada! 🔐' : 'Contraseña actualizada con éxito';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error cambiando password', err);
        let msg = this.isStudent ? '¡Ups! Algo salió mal 😵' : 'Error al cambiar la contraseña';
        
        if (err.status === 400 || err.status === 401) {
          msg = this.isStudent ? 'La llave actual no es correcta 🗝️' : 'La contraseña actual es incorrecta';
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