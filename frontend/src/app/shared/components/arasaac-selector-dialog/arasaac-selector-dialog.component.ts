import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArasaacService } from 'src/app/core/services/arasaac.service'; // Tu servicio existente

@Component({
  selector: 'app-arasaac-selector-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, 
    MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './arasaac-selector-dialog.component.html',
  styleUrls: ['./arasaac-selector-dialog.component.scss']
})
export class ArasaacSelectorDialogComponent {
  
  searchTerm: string = '';
  pictograms: any[] = [];
  loading: boolean = false;
  hasSearched: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ArasaacSelectorDialogComponent>,
    private arasaacService: ArasaacService
  ) {}

  buscar() {
    if (!this.searchTerm.trim()) return;

    this.loading = true;
    this.hasSearched = true;
    this.pictograms = []; // Limpiar anteriores

    this.arasaacService.searchPictograms(this.searchTerm).subscribe({
      next: (res) => {
        this.pictograms = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Opcional: Mostrar error
      }
    });
  }

  seleccionar(url: string) {
    // Cerramos el diálogo y devolvemos la URL seleccionada
    this.dialogRef.close(url);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
