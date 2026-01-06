import { Component, AfterViewInit, OnDestroy, OnInit, HostListener, ElementRef, ViewChildren, QueryList, Inject, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'], 
  encapsulation: ViewEncapsulation.None 
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy { // Agregamos OnInit aquí
  
  // --- ESTADO DEL COMPONENTE ---
  isMobileMenuOpen = false;
  isNavbarScrolled = false;
  
  // NUEVO: Variable para controlar qué botón mostrar
  estaLogueado: boolean = false; 

  // Propiedades para los modales
  modalVideoActivo: number | null = null;
  modalTextoActivo: number | null = null;
  videoUrl: SafeResourceUrl = '';

  // Referencias a los elementos del template que queremos animar al hacer scroll
  @ViewChildren('animatedEl, portfolioItem, aboutCard')
  elementsToAnimate!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  // Inyectamos servicios de Angular en el constructor
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private authService: AuthService // Inyectamos el servicio de autenticación
  ) {}

  // --- MÉTODOS DEL CICLO DE VIDA DE ANGULAR ---

  // NUEVO: Se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.verificarSesion();
  }

  ngAfterViewInit(): void {
    // Iniciamos el observador de animaciones después de que la vista se haya renderizado
    this.initAnimationObserver();
  }

  ngOnDestroy(): void {
    // Limpiamos el observador cuando el componente se destruye para evitar fugas de memoria
    this.observer?.disconnect();
  }

  // --- MÉTODOS PARA LA LÓGICA DEL COMPONENTE ---

  // NUEVO: Método auxiliar para verificar si hay token
  verificarSesion(): void {
    // Opción A: Si ya tienes un método en tu AuthService (Recomendado)
    // this.estaLogueado = this.authService.isAuthenticated();

    // Opción B: Si aún no tienes el método en el servicio, verificamos localStorage directamente aquí:
    const token = localStorage.getItem('access_token'); 
    this.estaLogueado = !!token; // Convierte el string a boolean (true si existe, false si es null)
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.document.body.style.overflow = 'auto';
    }
  }

  // Lógica para el scroll suave
  scrollTo(elementId: string): void {
    const element = this.document.getElementById(elementId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Ajuste para la altura de la navbar
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    this.closeMobileMenu(); // Cierra el menú después de hacer clic
  }

  // Lógica para abrir/cerrar los modales
  abrirVideo(videoId: string, num: number): void {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`);
    this.modalVideoActivo = num;
  }

  cerrarVideo(): void {
    this.modalVideoActivo = null;
    this.videoUrl = '';
  }

  abrirTexto(num: number): void {
    this.modalTextoActivo = num;
  }

  cerrarTexto(): void {
    this.modalTextoActivo = null;
  }

  // --- ESCUCHADORES DE EVENTOS GLOBALES ---

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Lógica para cambiar el estilo de la barra de navegación
    this.isNavbarScrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Cierra el menú móvil si se hace clic fuera de él
    if (this.isMobileMenuOpen && !target.closest('#mobileMenuToggle') && !target.closest('#mobileMenu')) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape', [])
  onKeydownHandler(): void {
    // Cierra el menú móvil al presionar la tecla 'Escape'
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Método para inicializar el IntersectionObserver para las animaciones
  private initAnimationObserver(): void {
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -80px 0px' };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          this.observer?.unobserve(entry.target); // Opcional: mejora el rendimiento
        }
      });
    }, observerOptions);

    // Nos aseguramos de que los elementos existan antes de observarlos
    if (this.elementsToAnimate) {
      this.elementsToAnimate.forEach(el => this.observer?.observe(el.nativeElement));
    }
  }
}