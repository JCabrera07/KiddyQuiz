import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClaseService } from 'src/app/core/services/clase.service';

@Component({
  selector: 'app-student-evaluation',
    imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './student-evaluation.component.html',
  styleUrl: './student-evaluation.component.scss'
})
export class StudentEvaluationComponent implements OnInit {

  evaluaciones: any[] = [];
  loading = true;
  idClase!: number;

  defaultImage =
    'https://cdn-icons-png.flaticon.com/512/1048/1048944.png';

  constructor(
    private route: ActivatedRoute,
    private claseService: ClaseService
  ) {}

  ngOnInit() {
    this.idClase = Number(this.route.snapshot.paramMap.get('id'));

    this.claseService.obtenerEvaluaciones(this.idClase).subscribe({
      next: (resp) => {
        this.evaluaciones = resp;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

