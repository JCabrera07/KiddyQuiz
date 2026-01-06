export interface Persona {
  id_persona?: number; // Opcional si no viene en este endpoint específico
  nombres: string;
  apellidos: string;
  edad: number;
  ciudad: string;
  sexo: string;
  rol: string; // "Estudiante", "Docente", etc.
  grado?: string; // Opcional
}

export interface UserProfile {
  id: number;
  username: string;
  persona: Persona[]; // Es un array según tu JSON
}