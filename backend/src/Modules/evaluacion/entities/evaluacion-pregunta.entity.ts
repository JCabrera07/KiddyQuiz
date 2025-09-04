import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, Unique } from 'typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';

@Entity('evaluacion_pregunta')
@Unique(['evaluacion', 'orden']) // <-- evita duplicados de orden por evaluación
export class EvaluacionPregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Evaluacion, e => e.evaluacionPreguntas)
  @JoinColumn({ name: 'id_evaluacion' }) // nombre exacto en la BD
  evaluacion: Evaluacion;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'id_pregunta' }) // nombre exacto en la BD
  pregunta: Pregunta;

  @Column({ type: 'int', nullable: true })
  orden: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

