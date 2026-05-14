import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Para marcar si es correcta
import { MatSelectModule } from '@angular/material/select';

// Servicios
import { TipoContenidoService } from 'src/app/core/services/tipo-contenido.service';
import { ArasaacSelectorDialogComponent } from 'src/app/shared/components/arasaac-selector-dialog/arasaac-selector-dialog.component';

@Component({
  selector: 'app-option-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatSelectModule
  ],
  templateUrl: './option-dialog.component.html',
  styleUrls: ['./option-dialog.component.scss'] // Reutilizaremos estilos si es posible
})
export class OptionDialogComponent implements OnInit {
  
  form: FormGroup;
  isEditMode = false;
  
  // Imagen / Arasaac
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedArasaacUrl: string | null = null;

  tiposContenido: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OptionDialogComponent>,
    private dialog: MatDialog,
    private tipoContenidoService: TipoContenidoService,
    @Inject(MAT_DIALOG_DATA) public data: any // data.preguntaId y data.opcion (si es edit)
  ) {
    this.form = this.fb.group({
      texto: ['', Validators.required],
      esCorrecta: [false],
      idTipoContenido: [null] // Opcional
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();

    if (this.data && this.data.opcion) {
      this.isEditMode = true;
      const op = this.data.opcion;
      
      this.form.patchValue({
        texto: op.texto,
        esCorrecta: op.esCorrecta,
        idTipoContenido: op.tipoContenido?.id || op.idTipoContenido
      });

      if (op.urlContenido) {
        this.imagePreview = op.urlContenido;
        if (typeof op.urlContenido === 'string' && op.urlContenido.includes('http')) {
          this.selectedArasaacUrl = op.urlContenido;
        }
      }
    }
  }

  cargarCatalogos() {
    this.tipoContenidoService.findAll().subscribe(res => this.tiposContenido = res);
  }

  // --- IMAGEN LOCAL ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedArasaacUrl = null;
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  // --- ARASAAC ---
  abrirSelectorArasaac() {
    const dialogRef = this.dialog.open(ArasaacSelectorDialogComponent, {
      width: '700px', autoFocus: false
    });

    dialogRef.afterClosed().subscribe((url) => {
      if (url) {
        this.selectedArasaacUrl = url;
        this.imagePreview = url;
        this.selectedFile = null;
      }
    });
  }

  guardar() {
    if (this.form.valid) {
      const formData = new FormData();
      
      // Campos requeridos por tu DTO
      formData.append('texto', this.form.get('texto')?.value);
      formData.append('esCorrecta', this.form.get('esCorrecta')?.value);
      
      // Si estamos creando, necesitamos el ID de la pregunta
      if (!this.isEditMode && this.data.preguntaId) {
        formData.append('idPregunta', this.data.preguntaId.toString());
      }
      
      const tipoCont = this.form.get('idTipoContenido')?.value;
      if (tipoCont) formData.append('idTipoContenido', tipoCont);

      // Imagen
      if (this.selectedFile) {
        formData.append('urlContenido', this.selectedFile); // El backend espera 'urlContenido' como key del archivo en FileInterceptor
      } else if (this.selectedArasaacUrl) {
        formData.append('urlContenido', this.selectedArasaacUrl); // Si es string, el DTO lo toma
      }

      this.dialogRef.close(formData);
    }
  }

  cancelar() { this.dialogRef.close(); }
}