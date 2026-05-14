import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
// 1. IMPORTAR ESTOS DOS:
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-evaluation-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDatepickerModule, MatNativeDateModule
  ],
  // 2. AGREGAR EL PROVIDER AQUÍ:
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-evaluation-dialog.component.html',
  styleUrls: ['./create-evaluation-dialog.component.scss']
})
export class CreateEvaluationDialogComponent implements OnInit {
  
  evalForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEvaluationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.evalForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Datos recibidos en el Dialog:', this.data);

    if (this.data && this.data.evaluacion) {
      this.isEditMode = true;
      const ev = this.data.evaluacion;
      
      console.log('Cargando evaluación:', ev);

      // Parchear valores con conversión de fecha segura
      this.evalForm.patchValue({
        titulo: ev.titulo,
        descripcion: ev.descripcion,
        // Convertimos string a Date para que el MatDatepicker lo entienda
        fechaInicio: ev.fechaInicio ? new Date(ev.fechaInicio) : new Date(),
        fechaFin: ev.fechaFin ? new Date(ev.fechaFin) : new Date()
      });

      if (ev.imagenUrl) {
        this.imagePreview = ev.imagenUrl;
      }
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (this.evalForm.valid) {
      const formData = new FormData();
      
      formData.append('titulo', this.evalForm.get('titulo')?.value);
      formData.append('descripcion', this.evalForm.get('descripcion')?.value || '');
      
      // Enviar fechas en formato ISO string
      const inicio = new Date(this.evalForm.get('fechaInicio')?.value);
      const fin = new Date(this.evalForm.get('fechaFin')?.value);
      
      formData.append('fechaInicio', inicio.toISOString());
      formData.append('fechaFin', fin.toISOString());
      
      if (this.data.claseId) {
        formData.append('claseId', this.data.claseId.toString());
      }

      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      this.dialogRef.close(formData);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}