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
    route: '/docente/analytics',       // ← corregido
    roles: ['Maestro']
  },
  {
    displayName: 'Mis Evaluaciones',
    iconName: 'solar:document-add-line-duotone',
    route: '/docente/evaluaciones',    // ← corregido
    roles: ['Maestro']
  },
  {
    displayName: 'Mis Estudiantes',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/docente/estudiantes',     // ← corregido
    roles: ['Maestro']
  },
];

