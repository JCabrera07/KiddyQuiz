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
import { QuizExitGuard } from './core/guards/quiz-exit.guard';
import { ResfuerzoIAComponent } from './features/student/resfuerzo-ia/resfuerzo-ia.component';
import { ProfileComponent } from './features/final-components/profile/profile.component';


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
      { path: 'resultado/:id', component: QuizResultsComponent },
      {path: 'estudiante/comentario-ia',component: AiFeedbackDialogComponent},
      { path: 'estudiante/resfuerzo-ia/:id', component: ResfuerzoIAComponent },
      { path: 'profile', component: ProfileComponent },
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
      path: 'class',
      loadComponent: () =>
        import('./features/teacher/class/class.component')
          .then(m => m.ClassComponent),
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

{
  path: 'exam-mode',
  component: BlankComponent,
  canActivate: [authGuard],
  children: [
    {
      path: 'quiz/:id',
      component: QuizViewComponent,
      canDeactivate: [QuizExitGuard]
    }
  ]
},


  // ==============================================
  // 3. RUTA COMODÍN
  // ==============================================
  { path: '**', redirectTo: '' },
];
