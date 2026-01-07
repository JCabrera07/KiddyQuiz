import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CompetenciaService, Competencia } from 'src/app/core/services/competencia.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reinforcement',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    NgIf,
    RouterModule,
    NgFor
  ],
  templateUrl: './reinforcement.component.html',
  styleUrls: ['./reinforcement.component.scss']
})
export class ReinforcementComponent implements OnInit {

  competencias: Competencia[] = [];
  isLoading = true;
  defaultImage = 'assets/images/backgrounds/Paisaje.jpg'; 

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private competenciaService: CompetenciaService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.isLoading = false;
      return;
    }

    // Traemos perfil del usuario para saber su grado
    this.userService.getUserProfile(userId).subscribe({
      next: (user) => {
        const idGrado = user.persona?.[0]?.id_grado;
        if (!idGrado) {
          console.error('El idGrado del usuario no está definido');
          this.isLoading = false;
          return;
        }
        this.loadCompetencias(idGrado);
      },
      error: (err) => {
        console.error('Error al obtener usuario', err);
        this.isLoading = false;
      }
    });
  }

  loadCompetencias(idGrado: number) {
    this.isLoading = true;
    this.competenciaService.getCompetenciasByGrado(idGrado).subscribe({
      next: (data) => {
        this.competencias = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar competencias', err);
        this.isLoading = false;
      }
    });
  }

  // trackBy para optimizar ngFor
  trackById(index: number, item: Competencia): number {
    return item.id;
  }

}



