import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  // ==============================================
  // SECCIÓN ESTUDIANTE
  // ==============================================
  {
    navCap: 'Principal',
    roles: ['Estudiante']
  },
  {
    displayName: 'Inicio',
    iconName: 'solar:home-angle-line-duotone',
    route: '/dashboard', // Ruta a tus tarjetas de evaluación
    roles: ['Estudiante']
  },
  {
    displayName: 'Mi Progreso',
    iconName: 'solar:chart-square-line-duotone',
    route: '/dashboard/student/student-progress', // Ruta a calificaciones y gráficos
    roles: ['Estudiante']
  },
  {
    displayName: 'Zona de Refuerzo',
    iconName: 'solar:dumbbell-large-minimalistic-line-duotone',
    route: '/dashboard/student/reinforcement', // Ruta a ejercicios de IA
    roles: ['Estudiante']
  },

  // ==============================================
  // SECCIÓN DOCENTE
  // ==============================================
  {
    navCap: 'Gestión Docente',
    roles: ['Maestro']
  },
  {
    displayName: 'Panel de Control',
    iconName: 'solar:widget-2-line-duotone',
    route: '/dashboard/teacher/teacher-analytics', // Resumen y alertas
    roles: ['Maestro']
  },
  {
    displayName: 'Mis Evaluaciones',
    iconName: 'solar:document-add-line-duotone',
    route: '/dashboard/teacher/evaluation-list', // Crear y editar exámenes
    roles: ['Maestro']
  },
  {
    displayName: 'Mis Estudiantes',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/dashboard/teacher/student-list', // Lista de alumnos
    roles: ['Maestro']
  },
];
