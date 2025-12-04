import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

// --- 1. IMPORTAMOS AMBOS GUARDIAS ---
import { authGuard } from 'src/app/auth/auth.guard'; 
// Asegúrate de que la ruta sea correcta (si lo pusiste en otra carpeta, ajusta aquí)
import { loginGuard } from 'src/app/auth/login.guard'; 

import { LandingComponent } from './pages/landing/landing.component'; 

// Tus otros componentes de página
import { QuizViewComponent } from './pages/student/quiz-view/quiz-view.component';
import { EvaluacionDetailComponent } from './pages/student/evaluacion-detail/evaluacion-detail.component';
import { QuizResultsComponent } from './pages/student/quiz-results/quiz-results.component';

export const routes: Routes = [
  // --- 2. RUTAS PÚBLICAS ---
  {
    path: '',
    component: BlankComponent, 
    children: [
      {
        path: '', 
        component: LandingComponent,
      },
      {
        path: 'authentication',
        // AQUI APLICAMOS EL GUARDIA INVERSO:
        // Si ya tiene sesión, NO lo deja entrar aquí y lo manda al Dashboard
        canActivate: [loginGuard], 
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
    component: FullComponent, 
    canActivate: [authGuard], // <-- PROTEGE EL DASHBOARD (Si NO tiene sesión, lo manda al Login)
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
  
  // --- 4. RUTA COMODÍN ---
  {
    path: '**',
    redirectTo: '', 
  },
];