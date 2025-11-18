import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-login',
  standalone: true, // <-- obligatorio para usar imports en un standalone component
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  constructor(private router: Router, private authService: AuthService) {}

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Formulario inválido:', this.form.value);
      return;
    }

    const username = this.f.username.value || '';
    const password = this.f.password.value || '';
    console.log('Intentando login con:', username, password);

    this.authService.login(username, password).subscribe({
      next: (res) => {
        console.log('Login exitoso', res);
        // Aquí puedes guardar token si tu backend lo envía
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en login', err);
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}

