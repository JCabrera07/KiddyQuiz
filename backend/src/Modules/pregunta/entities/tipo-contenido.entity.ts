import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { Opcion } from './opcion.entity';

@Entity('tipo_contenido')
export class TipoContenido {
  @PrimaryGeneratedColumn({ name: 'id_tipo_contenido' })
  id: number;

  @Column({ name: 'nombre_contenido', length: 50 })
  nombre: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Pregunta, pregunta => pregunta.tipoContenido)
  preguntas: Pregunta[];

  @OneToMany(() => Opcion, opcion => opcion.tipoContenido)
  opciones: Opcion[];
}
