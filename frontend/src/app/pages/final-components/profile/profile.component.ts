import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile, Persona } from 'src/app/models/user-profile.model';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

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
    TablerIconsModule
  ],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-label {
      font-weight: 600;
      color: #666;
    }
  `]
})
export class ProfileComponent implements OnInit {
  
  userProfile: UserProfile | null = null;
  personaData: Persona | null = null; 
  loading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
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
      width: '600px',
      maxWidth: '95vw',
      data: { 
        userProfile: this.userProfile, 
        personaData: this.personaData 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfile();
      }
    });
  }

  // 2. IMPLEMENTAR LA APERTURA DEL MODAL
  openChangePasswordModal() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px', // Más pequeño que el de perfil
      maxWidth: '95vw'
    });
  }
}