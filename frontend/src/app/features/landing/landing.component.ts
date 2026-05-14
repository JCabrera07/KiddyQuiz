import { Component, AfterViewInit, OnDestroy, OnInit, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'], 
  encapsulation: ViewEncapsulation.None 
})
export class LandingComponent implements OnInit {
  
  // Estado
  isMobileMenuOpen = false;
  isNavbarScrolled = false;
  
  userRole: string | null = null;
  estaLogueado: boolean = false; 
  
  // Control visual (Esta es la propiedad que faltaba)
  hasImage = false; 

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
  }

  // --- Lógica de Sesión ---
  verificarSesion(): void {
    const token = localStorage.getItem('access_token'); 
    this.estaLogueado = !!token;
    
    // Verificamos si existe el método antes de llamarlo para evitar errores
    if (this.authService && typeof this.authService.getUserRole === 'function') {
       this.userRole = this.authService.getUserRole();
    }
  }

  // --- Navegación ---
  navigateToLogin() {
    this.router.navigate(['/authentication/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/authentication/register']);
  }

  scrollTo(elementId: string): void {
    const element = this.document.getElementById(elementId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // --- Listeners ---
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isNavbarScrolled = window.scrollY > 20;
  }
}