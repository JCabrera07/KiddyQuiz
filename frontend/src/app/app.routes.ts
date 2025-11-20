import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

// --- 1. IMPORTA TU GUARDIA Y EL NUEVO COMPONENTE ---
import { authGuard } from 'src/app/auth/auth.guard'; // Asegúrate de que la ruta sea correcta
import { LandingComponent } from './pages/landing/landing.component'; // Asegúrate de que la ruta sea correcta

// Tus otros componentes de página
import { QuizViewComponent } from './pages/final-components/quiz-view/quiz-view.component';
import { EvaluacionDetailComponent } from './pages/final-components/evaluacion-detail/evaluacion-detail.component';
import { QuizResultsComponent } from './pages/final-components/quiz-results/quiz-results.component';

export const routes: Routes = [
  // --- 2. RUTAS PÚBLICAS (No requieren login) ---
  {
    path: '',
    component: BlankComponent, // Usan el layout simple, sin sidebar
    children: [
      {
        path: '', // La ruta raíz (ej: localhost:4200) ahora muestra la Landing Page
        component: LandingComponent,
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  // --- 3. RUTAS PROTEGIDAS (Requieren login) ---
  {
    path: '',
    component: FullComponent, // Usan el layout completo con sidebar
    canActivate: [authGuard], // <-- APLICAMOS EL GUARDIA A TODO ESTE GRUPO
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/final-components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'evaluacion/:id', 
        component: EvaluacionDetailComponent,
      },
      {
        path: 'quiz/:id',
        component: QuizViewComponent,
      },
      {
        path: 'resultado/:id', 
        component: QuizResultsComponent,
      },
    ],
  },
  // --- 4. RUTA COMODÍN (WILD CARD) ---
  {
    path: '**',
    redirectTo: '', // Redirige cualquier ruta no encontrada a la Landing Page
  },
];
