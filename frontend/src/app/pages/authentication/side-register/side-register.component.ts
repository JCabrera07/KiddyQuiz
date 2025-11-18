import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CatalogosService } from 'src/app/services/catalogos.service';

interface Rol {
  id: number;
  nombre: string;
}

interface Grado {
  id: number;
  nombre: string;
}

// 🔹 Payload que espera la API
interface RegisterPayload {
  nombres: string;
  apellidos: string;
  ciudad: string;
  fechaNacimiento: string; // YYYY-MM-DD
  edad: number;
  sexo: string;
  username: string;
  password: string;
  rolId: number;
  gradoId: number;
}

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {

  roles: Rol[] = [];
  grados: Grado[] = [];

  // Reactive Form
  registerForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    ciudad: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    edad: new FormControl('', [Validators.required, Validators.min(0)]),
    rol: new FormControl('', Validators.required),
    sexo: new FormControl('', Validators.required),
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    grado: new FormControl('', Validators.required)
  });

  constructor(private catalogosService: CatalogosService) {}

  ngOnInit(): void {
    this.catalogosService.getRoles().subscribe(data => this.roles = data);
    this.catalogosService.getGrados().subscribe(data => this.grados = data);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // 🔹 Crear payload tipado
    const payload: RegisterPayload = {
      nombres: this.registerForm.value.nombres!,
      apellidos: this.registerForm.value.apellidos!,
      ciudad: this.registerForm.value.ciudad!,
      fechaNacimiento: (this.registerForm.value.fechaNacimiento as unknown as Date).toISOString().split('T')[0],
      edad: Number(this.registerForm.value.edad!),
      sexo: this.registerForm.value.sexo!,
      username: this.registerForm.value.usuario!,
      password: this.registerForm.value.password!,
      rolId: Number(this.registerForm.value.rol!),
      gradoId: Number(this.registerForm.value.grado!)
    };

    console.log('Datos listos para enviar a API:', payload);

    this.catalogosService.registerUser(payload).subscribe({
      next: (res) => {
        console.log('Usuario registrado', res);
        alert('Registro exitoso');
      },
      error: (err) => {
        console.error('Error al registrar', err);
        alert('Ocurrió un error en el registro');
      }
    });
  }
}


