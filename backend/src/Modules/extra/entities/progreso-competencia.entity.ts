import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
// Ajusta estas rutas de importación según tu estructura real si es necesario
import { Usuario } from 'src/Modules/usuario/entities/usuario.entity'; 
import { Competencia } from 'src/Modules/extra/entities/competencia.entity'; // O donde tengas Competencia
import { DetalleEvaluacion } from 'src/Modules/evaluacion/entities/detalle-evaluacion.entity';

@Entity('progreso_competencia')
@Unique(['estudiante', 'competencia']) // Coincide con tu CONSTRAINT uq_estudiante_competencia
export class ProgresoCompetencia {

  @PrimaryGeneratedColumn({ name: 'id_progreso' })
  id: number;

  @ManyToOne(() => Usuario, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Usuario;

  @ManyToOne(() => Competencia, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;

  @ManyToOne(() => DetalleEvaluacion, { nullable: true })
  @JoinColumn({ name: 'id_detalle_evaluacion' })
  detalleEvaluacion: DetalleEvaluacion;

  @Column({ name: 'total_preguntas', type: 'int' })
  totalPreguntas: number;

  @Column({ name: 'preguntas_correctas', type: 'int' })
  preguntasCorrectas: number;

  // Usamos 'decimal' para mapear NUMERIC(5,2) correctamente
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentaje: number;

  @Column({ default: false })
  logrado: boolean;

  @Column({ name: 'fecha_logro', type: 'timestamp', nullable: true })
  fechaLogro: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
