import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-class-dialog',
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
  ],
  templateUrl: './create-class-dialog.component.html',
  styleUrls: ['./create-class-dialog.component.scss']
})
export class CreateClassDialogComponent implements OnInit{
  
  claseForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isEditMode: boolean = false; // Bandera para saber si editamos

  // Simulación de grados (Lo ideal es cargarlos de un servicio)
  grados = [
    { id: 1, nombre: 'Segundo Básico' },
    { id: 2, nombre: 'Tercero Básico' },
    { id: 3, nombre: 'Cuarto Básico' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.claseForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      gradoId: [null, [Validators.required]] // El backend espera un número
    });
  }

  ngOnInit(): void {
    // Si 'data' tiene contenido, estamos EDITANDO
    if (this.data) {
      this.isEditMode = true;
      
      // Rellenamos el formulario
      this.claseForm.patchValue({
        nombre: this.data.nombre,
        gradoId: this.data.grado?.id || this.data.idGrado // Ajusta según venga tu objeto
      });

      // Si ya tiene imagen, mostramos el preview
      if (this.data.imagenUrl) {
        this.imagePreview = this.data.imagenUrl;
      }
    }
  }

  // Detectar cuando el usuario selecciona un archivo
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Guardar y enviar datos al padre
  guardar() {
    if (this.claseForm.valid) {
      const formData = new FormData();
      
      // Agregamos campos de texto
      formData.append('nombre', this.claseForm.get('nombre')?.value);
      formData.append('gradoId', this.claseForm.get('gradoId')?.value); // IMPORTANTE: Tu DTO pide gradoId
      
      // Agregamos el archivo si existe
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile); // 'imagen' es el nombre que pusiste en el FileInterceptor del backend
      }

      // Cerramos el modal enviando el FormData
      this.dialogRef.close(formData);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
