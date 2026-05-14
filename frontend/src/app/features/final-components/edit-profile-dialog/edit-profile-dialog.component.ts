import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
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
  styleUrls: ['./edit-profile-dialog.component.scss'] // 👈 Conectamos el SCSS externo
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
      username: [{value: '', disabled: true}], 
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      ciudad: ['', Validators.required],
      sexo: ['', Validators.required]
    });
  }

  // Getter para verificar si es estudiante basado en la data inyectada
  get isStudent(): boolean {
    return this.data?.isStudent === true;
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
      const payload = this.form.getRawValue(); 
      
      this.userService.updateProfile(userId, payload).subscribe({
        next: () => {
          // Mensaje personalizado según el rol
          const msg = this.isStudent ? '¡Carnet Actualizado! 🚀' : 'Perfil actualizado correctamente';
          this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
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