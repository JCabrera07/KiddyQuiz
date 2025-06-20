import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Rol } from './rol.entity';
import { Grado } from '../../grado/entities/grado.entity';

@Entity('persona')
export class Persona {
  @PrimaryGeneratedColumn({ name: 'id_persona' })
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.personas)
  usuario: Usuario;

  @ManyToOne(() => Rol, rol => rol.personas)
  rol: Rol;

  @ManyToOne(() => Grado, grado => grado.personas)
  grado: Grado;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ nullable: true })
  edad: number;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ nullable: true })
  sexo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
