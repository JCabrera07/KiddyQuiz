import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Persona } from './persona.entity';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id: number;

  @Column({ name: 'nombre_rol', length: 50 })
  nombre: string;

  @OneToMany(() => Persona, persona => persona.rol)
  personas: Persona[];
}
