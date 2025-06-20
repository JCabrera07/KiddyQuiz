import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TipoPregunta } from './tipo-pregunta.entity';
import { Dificultad } from './dificultad.entity';
import { TipoContenido } from './tipo-contenido.entity';
import { Opcion } from './opcion.entity';

@Entity('pregunta')
export class Pregunta {
  @PrimaryGeneratedColumn({ name: 'id_pregunta' })
  id: number;

  @ManyToOne(() => TipoPregunta, tipo => tipo.preguntas)
  tipoPregunta: TipoPregunta;

  @ManyToOne(() => Dificultad, dificultad => dificultad.preguntas)
  dificultad: Dificultad;

  @Column({ type: 'text' })
  enunciado: string;

  @ManyToOne(() => TipoContenido, tipo => tipo.preguntas)
  tipoContenido: TipoContenido;

  @Column({ name: 'url_contenido', nullable: true })
  urlContenido: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Opcion, opcion => opcion.pregunta)
  opciones: Opcion[];
}
