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
    displayName: 'Mis clases',
    iconName: 'solar:home-angle-line-duotone',
    route: '/estudiante/mis-clases',
    roles: ['Estudiante']
  },
  {
    displayName: 'Mi Progreso',
    iconName: 'solar:chart-square-line-duotone',
    route: '/estudiante/mi-progreso',    
    roles: ['Estudiante']
  },
  {
    displayName: 'Zona de Refuerzo',
    iconName: 'solar:dumbbell-large-minimalistic-line-duotone',
    route: '/estudiante/refuerzo',   
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
    route: '/teacher/teacher-analytics',       // ← corregido
    roles: ['Maestro']
  },
  {
    displayName: 'Mis Clases',
    iconName: 'solar:document-add-line-duotone',
    route: '/teacher/class',    // ← corregido
    roles: ['Maestro']
  },
  {
    displayName: 'Mis Estudiantes',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/teacher/student-list',     // ← corregido
    roles: ['Maestro']
  },
];

