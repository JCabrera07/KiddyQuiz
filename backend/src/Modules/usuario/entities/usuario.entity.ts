import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Persona } from './persona.entity';
import { DetalleEvaluacion } from '../../evaluacion/entities/detalle-evaluacion.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  contrasena: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Persona, persona => persona.usuario)
  personas: Persona[];

  @OneToMany(() => DetalleEvaluacion, detalle => detalle.usuario)
  detallesEvaluacion: DetalleEvaluacion[];
}
