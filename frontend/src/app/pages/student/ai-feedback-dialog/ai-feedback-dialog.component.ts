import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-feedback-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './ai-feedback-dialog.component.html',
  styles: [`
    .ai-content {
      font-family: 'Roboto', sans-serif;
      line-height: 1.6;
      white-space: pre-wrap; /* Respeta los saltos de línea de la IA */
      color: #333;
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      border-left: 5px solid #673ab7; /* Borde morado estilo IA */
    }
    /* Estilo para simular negritas del markdown básico */
    .ai-content strong {
      color: #673ab7;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AiFeedbackDialogComponent {
  
  formattedContent: string = '';

  constructor(
    public dialogRef: MatDialogRef<AiFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comentario: string }
  ) {
    this.formatText(data.comentario);
  }

  // Pequeña utilidad para convertir Markdown básico (**texto**) a HTML <b>texto</b>
  formatText(text: string) {
    if (!text) return;
    // Reemplazar **texto** por <strong>texto</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Reemplazar * items de lista por guiones más bonitos
    html = html.replace(/^\* /gm, '• ');
    this.formattedContent = html;
  }

  cerrar() {
    this.dialogRef.close();
  }
}