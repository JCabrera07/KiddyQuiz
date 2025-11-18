import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {

  resultado: any; // Aquí guardaremos los datos

  constructor(private router: Router, private route: ActivatedRoute) {
    // Es la mejor práctica leer el estado del router en el constructor
    const navigation = this.router.getCurrentNavigation();
    this.resultado = navigation?.extras.state?.['data'];
  }

  ngOnInit(): void {
    // Fallback: si el usuario recarga la página, el estado se pierde.
    // Aquí podrías llamar a un servicio para obtener los resultados usando el ID de la URL.
    if (!this.resultado) {
      const id = this.route.snapshot.paramMap.get('id');
      console.log('El estado se perdió. Se debería hacer una llamada a la API para obtener los resultados del intento con ID:', id);
      // this.resultadoService.getResultado(id).subscribe(...);
    }
  }

  get calificacionNumero(): number {
    return this.resultado ? parseFloat(this.resultado.calificacion) : 0;
  }
}
