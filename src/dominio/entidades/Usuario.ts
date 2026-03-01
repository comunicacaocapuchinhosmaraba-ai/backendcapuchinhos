import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoUsuario {
  ADMIN = 'admin',
  EDITOR = 'editor'
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ length: 100 })
  nome: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.EDITOR
  })
  tipo: TipoUsuario;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  constructor(partial?: Partial<Usuario>) {
    Object.assign(this, partial);
  }
}
