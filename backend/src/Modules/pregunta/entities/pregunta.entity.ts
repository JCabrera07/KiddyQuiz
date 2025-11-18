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

@Entity('pregunta')
export class Pregunta {
  @PrimaryGeneratedColumn({ name: 'id_pregunta' })
  id: number;

@ManyToOne(() => TipoPregunta, tipo => tipo.preguntas)
@JoinColumn({ name: 'id_tipo_pregunta' }) // aquí indicas el nombre real de la columna en la DB
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
}
