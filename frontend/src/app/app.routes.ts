import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

import { LandingComponent } from './features/landing/landing.component';

import { QuizViewComponent } from './features/student/quiz-view/quiz-view.component';
import { EvaluacionDetailComponent } from './features/student/evaluacion-detail/evaluacion-detail.component';
import { QuizResultsComponent } from './features/student/quiz-results/quiz-results.component';
import { MisClasesComponent } from './features/student/mis-clases/mis-clases.component';
import { AiFeedbackDialogComponent } from './features/student/ai-feedback-dialog/ai-feedback-dialog.component';


export const routes: Routes = [
  // ==============================================
  // 1. RUTAS PÚBLICAS
  // ==============================================
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: '', component: LandingComponent },
      {
        path: 'authentication',
        canActivate: [loginGuard],
        loadChildren: () =>
          import('./features/authentication/authentication.routes').then(
            m => m.AuthenticationRoutes
          ),
      },
    ],
  },

  // ==============================================
  // 2. RUTAS PROTEGIDAS (ESTUDIANTE + DOCENTE)
  // ==============================================
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [

      // Redirección principal
      { path: '', redirectTo: '/estudiante/mis-clases', pathMatch: 'full' },

      // -----------------------------
      // ESTUDIANTE
      // -----------------------------
      {
        path: 'estudiante',
        children: [
          {
            path: 'mis-clases',
            component: MisClasesComponent,
            data: { title: 'Mis Clases' }
          },
          {
            path: 'mi-progreso',
            loadComponent: () =>
              import('./features/student/student-progress/student-progress.component')
                .then(m => m.StudentProgressComponent),
            data: { title: 'Mi Progreso' }
          },
          {
            path: 'refuerzo',
            loadComponent: () =>
              import('./features/student/reinforcement/reinforcement.component')
                .then(m => m.ReinforcementComponent),
            data: { title: 'Zona de Refuerzo' }
          },
          {
  path: 'clase/:id/evaluaciones',
  loadComponent: () =>
    import('./features/student/student-evaluation/student-evaluation.component')
      .then(m => m.StudentEvaluationComponent),
  data: { title: 'Evaluaciones de la Clase' }
}

        ]
      },

      // -----------------------------
      // ESTUDIANTE (rutas individuales)
      // -----------------------------
      { path: 'evaluacion/:id', component: EvaluacionDetailComponent },
      { path: 'quiz/:id', component: QuizViewComponent },
      { path: 'resultado/:id', component: QuizResultsComponent },
      {path: 'estudiante/comentario-ia',component: AiFeedbackDialogComponent},
      // -----------------------------
      // DOCENTE
      // -----------------------------
      {
        path: 'teacher',
        children: [
          {
            path: 'teacher-analytics',
            loadComponent: () =>
              import('./features/teacher/teacher-analytics/teacher-analytics.component')
                .then(m => m.TeacherAnalyticsComponent),
            data: { title: 'Panel de Control' }
          },
          {
            path: 'evaluation-list',
            loadComponent: () =>
              import('./features/teacher/evaluation-list/evaluation-list.component')
                .then(m => m.EvaluationListComponent),
            data: { title: 'Mis Evaluaciones' }
          },
          {
            path: 'student-list',
            loadComponent: () =>
              import('./features/teacher/student-list/student-list.component')
                .then(m => m.StudentListComponent),
            data: { title: 'Mis Estudiantes' }
          },
        ]
      },
    ]
  },

  // ==============================================
  // 3. RUTA COMODÍN
  // ==============================================
  { path: '**', redirectTo: '' },
];
