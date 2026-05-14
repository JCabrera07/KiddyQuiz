import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Agregamos MatDialog para poder abrir el OTRO modal
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

// SERVICIOS EXISTENTES
import { CompetenciaService } from 'src/app/core/services/competencia.service';
import { DificultadService } from 'src/app/core/services/dificultad.service';
import { TipoPreguntaService } from 'src/app/core/services/tipo-pregunta.service';
import { TipoContenidoService } from 'src/app/core/services/tipo-contenido.service';

// COMPONENTE COMPARTIDO (Asegúrate de que la ruta sea correcta)
import { ArasaacSelectorDialogComponent } from 'src/app/shared/components/arasaac-selector-dialog/arasaac-selector-dialog.component';

@Component({
  selector: 'app-question-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatIconModule
    // Eliminamos MatTabs, FormsModule y MatProgressSpinner porque ya no se usan aquí
  ],
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit {
  
  questionForm: FormGroup;
  isEditMode: boolean = false;
  
  // Variables para imagen
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedArasaacUrl: string | null = null;

  // Catálogos
  tiposPregunta: any[] = [];
  dificultades: any[] = [];
  competencias: any[] = [];
  tiposContenido: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QuestionDialogComponent>,
    // Inyectamos MatDialog para abrir el selector compartido
    private dialog: MatDialog, 
    private competenciaService: CompetenciaService,
    private dificultadService: DificultadService,
    private tipoPreguntaService: TipoPreguntaService,
    private tipoContenidoService: TipoContenidoService,
    // Eliminamos ArasaacService de aquí (se usa en el hijo)
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.questionForm = this.fb.group({
      enunciado: ['', [Validators.required, Validators.minLength(5)]],
      idTipoPregunta: [null, Validators.required],
      idDificultad: [null, Validators.required],
      idCompetencia: [null, Validators.required],
      idTipoContenido: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();

    if (this.data && this.data.pregunta) {
      this.isEditMode = true;
      const q = this.data.pregunta;
      
      this.questionForm.patchValue({
        enunciado: q.enunciado,
        idTipoPregunta: q.tipoPregunta?.id || q.idTipoPregunta,
        idDificultad: q.dificultad?.id || q.idDificultad,
        idCompetencia: q.competencia?.id || q.idCompetencia,
        idTipoContenido: q.tipoContenido?.id || q.idTipoContenido
      });

      // Si ya tiene imagen, la mostramos en el preview
      if (q.urlContenido) {
        this.imagePreview = q.urlContenido;
        // Detectamos si es una URL (Arasaac o externa)
        if (typeof q.urlContenido === 'string' && q.urlContenido.includes('http')) {
             this.selectedArasaacUrl = q.urlContenido;
        }
      }
    }
  }

cargarCatalogos() {
  this.tipoPreguntaService.findAll().subscribe(res => {
    console.log('Tipos de Pregunta cargados:', res); // <--- DEBE MOSTRAR ARRAY CON DATOS
    this.tiposPregunta = res;
  });
  
  this.dificultadService.findAll().subscribe(res => {
    console.log('Dificultades cargadas:', res); // <--- DEBE MOSTRAR ARRAY CON DATOS
    this.dificultades = res;
  });
  
  this.tipoContenidoService.findAll().subscribe(res => {
    console.log('Tipos Contenido cargados:', res); // <--- DEBE MOSTRAR ARRAY CON DATOS
    this.tiposContenido = res;
  });

  this.competenciaService.findAll().subscribe(res => this.competencias = res);
}

  // --- LÓGICA DE ARCHIVO LOCAL ---
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedArasaacUrl = null; // Limpiamos selección de Arasaac si sube archivo
      
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  // --- NUEVA LÓGICA: ABRIR EL DIALOG COMPARTIDO ---
  abrirSelectorArasaac() {
    const dialogRef = this.dialog.open(ArasaacSelectorDialogComponent, {
      width: '700px',
      // panelClass: 'dialog-empresarial', // Descomenta si usas estilos globales
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((urlSeleccionada) => {
      if (urlSeleccionada) {
        // El usuario seleccionó una imagen y el modal devolvió la URL
        this.selectedArasaacUrl = urlSeleccionada;
        this.imagePreview = urlSeleccionada; // Actualizamos vista previa
        this.selectedFile = null; // Limpiamos si había archivo local
      }
    });
  }

  // --- GUARDADO ---
guardar() {
    if (this.questionForm.valid) {
      const formData = new FormData();

      // Campos de texto
      formData.append('enunciado', this.questionForm.get('enunciado')?.value);
      formData.append('idTipoPregunta', this.questionForm.get('idTipoPregunta')?.value);
      formData.append('idDificultad', this.questionForm.get('idDificultad')?.value);
      formData.append('idCompetencia', this.questionForm.get('idCompetencia')?.value);
      
      const idTipoCont = this.questionForm.get('idTipoContenido')?.value;
      if (idTipoCont) {
         formData.append('idTipoContenido', idTipoCont);
      }

      // --- LÓGICA DE IMAGEN CORREGIDA ---
      
      // CASO 1: Subió un archivo nuevo desde PC
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile); 
      } 
      // CASO 2: Seleccionó ARASAAC o mantuvo la URL existente (Texto)
      else if (this.selectedArasaacUrl) {
        formData.append('urlContenido', this.selectedArasaacUrl);
      }
      // CASO 3: Si quieres permitir borrar la imagen, podrías enviar vacío, 
      // pero por ahora con los casos 1 y 2 cubres la edición.

      this.dialogRef.close(formData);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}