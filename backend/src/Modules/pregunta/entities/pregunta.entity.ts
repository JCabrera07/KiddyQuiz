import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TipoPregunta } from './tipo-pregunta.entity';
import { Dificultad } from './dificultad.entity';
import { TipoContenido } from './tipo-contenido.entity';
import { Opcion } from './opcion.entity';
import { Competencia } from 'src/Modules/extra/entities/competencia.entity';
import { EvaluacionPregunta } from '../../evaluacion/entities/evaluacion-pregunta.entity'; 

@Entity('pregunta')
export class Pregunta {
  @PrimaryGeneratedColumn({ name: 'id_pregunta' })
  id: number;

  @ManyToOne(() => TipoPregunta, tipo => tipo.preguntas)
  @JoinColumn({ name: 'id_tipo_pregunta' })
  tipoPregunta: TipoPregunta;

  @ManyToOne(() => Dificultad, dificultad => dificultad.preguntas)
  @JoinColumn({ name: 'id_dificultad' })
  dificultad: Dificultad;

  @ManyToOne(() => TipoContenido, tipo => tipo.preguntas)
  @JoinColumn({ name: 'id_tipo_contenido' })
  tipoContenido: TipoContenido;

  @Column({ type: 'text' })
  enunciado: string;

  @Column({ name: 'url_contenido', type: 'text', nullable: true })
  urlContenido?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Opcion, opcion => opcion.pregunta)
  opciones: Opcion[];

  // 1. Relación inversa con Evaluaciones (VITAL)
  @OneToMany(() => EvaluacionPregunta, (ep) => ep.pregunta)
  evaluaciones: EvaluacionPregunta[];

  // 2. Columna explícita para el ID 
  @Column({ name: 'id_competencia', nullable: true })
  idCompetencia: number;

  @ManyToOne(() => Competencia, (competencia) => competencia.preguntas, { nullable: true })
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;
}
