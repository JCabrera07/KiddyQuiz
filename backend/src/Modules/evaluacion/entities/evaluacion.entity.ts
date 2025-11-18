import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EvaluacionPregunta } from './evaluacion-pregunta.entity';
import { DetalleEvaluacion } from './detalle-evaluacion.entity';

@Entity('evaluacion')
export class Evaluacion {
  @PrimaryGeneratedColumn({ name: 'id_evaluacion' })
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ name: 'imagen_url', nullable: true })
  imagenUrl: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ name: 'fecha_inicio', type: 'timestamp', nullable: true })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true })
  fechaFin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => EvaluacionPregunta, ep => ep.evaluacion)
  evaluacionPreguntas: EvaluacionPregunta[];

  @OneToMany(() => DetalleEvaluacion, de => de.evaluacion)
  detalles: DetalleEvaluacion[];
}
