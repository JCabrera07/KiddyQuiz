import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styles: [`
    /* Estilo general del formulario */
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 16px; /* Espacio vertical entre filas */
      padding-top: 10px;
    }

    mat-form-field {
      width: 100%;
    }

    /* GRILLA DE 2 COLUMNAS (Nombres, Apellidos) */
    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Dos columnas iguales */
      gap: 16px; /* Espacio entre columnas */
    }

    /* GRILLA DE 3 COLUMNAS (Edad, Sexo, Ciudad) */
    .form-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* Tres columnas iguales */
      gap: 16px;
    }

    /* RESPONSIVO: En celular, todo se vuelve de 1 sola columna */
    @media (max-width: 600px) {
      .form-grid-2, .form-grid-3 {
        grid-template-columns: 1fr; /* Una sola columna */
        gap: 10px;
      }
    }
  `]
})
export class EditProfileDialogComponent implements OnInit {
  
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<EditProfileDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.form = this.fb.group({
      username: [{value: '', disabled: true}], // Usuario no editable usualmente
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      ciudad: ['', Validators.required],
      sexo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        username: this.data.userProfile.username,
        nombres: this.data.personaData.nombres,
        apellidos: this.data.personaData.apellidos,
        edad: this.data.personaData.edad,
        ciudad: this.data.personaData.ciudad,
        sexo: this.data.personaData.sexo
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;

    this.loading = true;
    const userId = this.authService.getUserIdFromToken();
    
    if (userId) {
      // Usamos getRawValue() para incluir el username aunque esté disabled (si la API lo exige)
      const payload = this.form.getRawValue(); 
      
      this.userService.updateProfile(userId, payload).subscribe({
        next: () => {
          this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error', err);
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}