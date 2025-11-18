import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Persona } from '../../usuario/entities/persona.entity';

@Entity('grado')
export class Grado {
  @PrimaryGeneratedColumn({ name: 'id_grado' })
  id: number;

  @Column({ name: 'nombre_grado', length: 50 })
  nombre: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Persona, persona => persona.grado)
  personas: Persona[];
}
