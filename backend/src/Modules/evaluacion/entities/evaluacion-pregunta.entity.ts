import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';

@Entity('evaluacion_pregunta')
export class EvaluacionPregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Evaluacion, e => e.evaluacionPreguntas)
  evaluacion: Evaluacion;

  @ManyToOne(() => Pregunta)
  pregunta: Pregunta;

  @Column({ nullable: true })
  orden: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
