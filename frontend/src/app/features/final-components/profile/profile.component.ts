import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfile, Persona } from 'src/app/core/models/user-profile.model';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    TablerIconsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  // IMPORTANTE: Asegúrate de que apunte a tu archivo SCSS externo
  styleUrls: ['./profile.component.scss'] 
})
export class ProfileComponent implements OnInit {
  
  userProfile: UserProfile | null = null;
  personaData: Persona | null = null; 
  loading = true;
  userRole: string = ''; // 1. Variable para el rol

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  // 2. Getter para facilitar la condicional en el HTML
get isStudent(): boolean {
    return (this.userRole || '').toUpperCase() === 'ESTUDIANTE';
  }

  ngOnInit(): void {
    // 3. Obtenemos el rol antes de cargar el perfil
    this.userRole = this.authService.getUserRole() || '';
    this.loadProfile();
  }

  loadProfile() {
    const userId = this.authService.getUserIdFromToken();
    
    if (userId) {
      this.userService.getUserProfile(userId).subscribe({
        next: (data) => {
          this.userProfile = data;
          if (data.persona && data.persona.length > 0) {
            this.personaData = data.persona[0];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar perfil', err);
          this.loading = false;
        }
      });
    }
  }

  openEditProfileModal() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: this.isStudent ? '500px' : '600px', // Modal un poco más pequeño para niños
      maxWidth: '95vw',
      // Puedes pasar el dato 'isStudent' al modal si quieres personalizarlo también
      data: { 
        userProfile: this.userProfile, 
        personaData: this.personaData,
        isStudent: this.isStudent 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfile();
      }
    });
  }

openChangePasswordModal() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: this.isStudent ? '450px' : '400px', // Un poco más ancho para niños
      maxWidth: '95vw',
      // 👇 ¡IMPORTANTE! Pasar el dato aquí
      data: { 
        isStudent: this.isStudent 
      }
    });
  }
}