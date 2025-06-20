import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { TipoContenido } from './tipo-contenido.entity';

@Entity('opcion')
export class Opcion {
  @PrimaryGeneratedColumn({ name: 'id_opcion' })
  id: number;

  @ManyToOne(() => Pregunta, pregunta => pregunta.opciones)
  pregunta: Pregunta;

  @Column({ name: 'texto_opcion', type: 'text' })
  texto: string;

  @ManyToOne(() => TipoContenido, tipo => tipo.opciones)
  tipoContenido: TipoContenido;

  @Column({ name: 'url_contenido', nullable: true })
  urlContenido: string;

  @Column({ name: 'es_correcta', default: false })
  esCorrecta: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
