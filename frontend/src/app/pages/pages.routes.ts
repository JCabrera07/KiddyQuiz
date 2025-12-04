import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';

// --- 1. IMPORTA TUS COMPONENTES DE DOCENTE ---
// Asegúrate de que estas rutas coincidan con las carpetas que creaste
import { TeacherAnalyticsComponent } from './teacher/teacher-analytics/teacher-analytics.component';
import { EvaluationListComponent } from './teacher/evaluation-list/evaluation-list.component';
import { StudentListComponent } from './teacher/student-list/student-list.component';
import { EvaluationEditorComponent } from './teacher/evaluation-editor/evaluation-editor.component';

// --- 2. IMPORTA TUS COMPONENTES DE ESTUDIANTE ---
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentProgressComponent } from './student/student-progress/student-progress.component';
import { ReinforcementComponent } from './student/reinforcement/reinforcement.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Starter' },
      ],
    },
  },
  
  // ==============================================================
  // RUTAS DEL DOCENTE (Maestro)
  // ==============================================================
  {
    path: 'teacher/teacher-analytics',
    component: TeacherAnalyticsComponent,
    data: { title: 'Panel de Control Docente' }
  },
  {
    path: 'teacher/evaluation-list',
    component: EvaluationListComponent,
    data: { title: 'Gestión de Evaluaciones' }
  },
  {
    path: 'teacher/student-list',
    component: StudentListComponent,
    data: { title: 'Lista de Estudiantes' }
  },
  {
    path: 'teacher/evaluation-editor',
    component: EvaluationEditorComponent,
    data: { title: 'Editor de Evaluaciones' }
  },

  // ==============================================================
  // RUTAS DEL ESTUDIANTE
  // ==============================================================
  {
    path: 'student/student-dashboard',
    component: StudentDashboardComponent,
    data: { title: 'Inicio Estudiante' }
  },
  {
    path: 'student/student-progress',
    component: StudentProgressComponent,
    data: { title: 'Mi Progreso' }
  },
  {
    path: 'student/reinforcement',
    component: ReinforcementComponent,
    data: { title: 'Zona de Refuerzo' }
  },
];