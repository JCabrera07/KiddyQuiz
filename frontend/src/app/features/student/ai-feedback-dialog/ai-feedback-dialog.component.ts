import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MarkdownPipe } from 'src/app/shared/pipes/markdown.pipe';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-feedback-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MarkdownPipe
  ],
  templateUrl: './ai-feedback-dialog.component.html',
  styleUrls: ['./ai-feedback-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AiFeedbackDialogComponent {
  comentario: string = '';
  loading: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AiFeedbackDialogComponent>,
    private router: Router
  ) {
    if (data && data.comentario) {
      setTimeout(() => {
        this.comentario = data.comentario;
        this.loading = false;
      }, 300);
    } else {
      this.comentario = 'No se recibió comentario.';
      this.loading = false;
    }
  }

  // Método para cerrar el modal
  cerrar() {
    this.dialogRef.close();
        this.router.navigate(['/estudiante/mis-clases']); 
  }
}




