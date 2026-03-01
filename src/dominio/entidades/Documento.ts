// src/dominio/entidades/Documento.ts
import { Usuario } from './Usuario';

/* ===============================
 * ENUMS
 * =============================== */

export enum CategoriaDocumento {
  RELATORIO = 'Relatorios',
  PRESTACAO_CONTAS = 'Prestacao de contas',
  DOCUMENTOS = 'Documentos',
}

export enum StatusDocumento {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  ARQUIVADO = 'arquivado',
}

/* ===============================
 * ENTIDADE DE DOMÍNIO
 * =============================== */

export class Documento {
  id!: string;

  titulo!: string;
  categoria!: CategoriaDocumento;

  nota?: string | null;
  data?: string | null; // YYYY-MM

  nomeArquivo!: string;
  caminhoArquivo!: string;
  tipoArquivo!: string;
  tamanhoArquivo!: number;

  urlPublica?: string | null;

  status!: StatusDocumento;

  criadoPor?: Usuario;

  criadoEm!: Date;
  atualizadoEm!: Date;

  constructor(props: Partial<Documento>) {
    Object.assign(this, props);
  }
}