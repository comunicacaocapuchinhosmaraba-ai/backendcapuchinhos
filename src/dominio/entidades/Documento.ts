// caminho: src/dominio/entidades/Documento.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario'; // import relativo, sem alias

export enum CategoriaDocumento {
  RELATORIO = 'Relatorios',
  PRESTACAO_CONTAS = 'Prestacao de contas',
  DOCUMENTOS = 'Documentos'
}

export enum StatusDocumento {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  ARQUIVADO = 'arquivado'
}

@Entity('documentos')
export class Documento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'enum', enum: CategoriaDocumento })
  categoria: CategoriaDocumento;

  @Column({ type: 'text', nullable: true })
  nota: string;

  @Column({ length: 20 })
  data: string; // YYYY-MM

  @Column({ name: 'nome_arquivo', length: 255 })
  nomeArquivo: string;

  @Column({ name: 'caminho_arquivo', length: 500 })
  caminhoArquivo: string;

  @Column({ name: 'tipo_arquivo', length: 50 })
  tipoArquivo: string;

  @Column({ name: 'tamanho_arquivo', type: 'bigint' })
  tamanhoArquivo: number;

  @Column({ type: 'enum', enum: StatusDocumento, default: StatusDocumento.ATIVO })
  status: StatusDocumento;

  @Column({ name: 'url_publica', length: 500, nullable: true })
  urlPublica: string;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'criado_por_id' })
  criadoPor: Usuario;

  @Column({ name: 'criado_por_id' })
  criadoPorId: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  constructor(partial?: Partial<Documento>) {
    Object.assign(this, partial);
  }
}
