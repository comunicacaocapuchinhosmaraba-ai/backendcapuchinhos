import fs from 'fs/promises';
import path from 'path';
import {
  IArmazenamentoServico,
  ArquivoUpload
} from '@dominio/servicos/IArmazenamentoServico';

export class ArmazenamentoServico implements IArmazenamentoServico {
  private uploadDir: string;
  private maxFileSize: number;
  private tiposPermitidos: string[];

  constructor() {
    this.uploadDir =
      process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');

    // 10 MB padrão
    this.maxFileSize = Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024);

    this.tiposPermitidos = [
      // PDF
      'application/pdf',

      // Word
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      // Excel
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      // Imagens
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
  }

  async salvarArquivo(arquivo: ArquivoUpload): Promise<string> {
    if (!this.validarTipoArquivo(arquivo.mimetype)) {
      throw new Error('Tipo de arquivo não permitido');
    }

    if (!this.validarTamanhoArquivo(arquivo.size)) {
      throw new Error('Arquivo excede o tamanho máximo permitido');
    }

    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');

    const diretorio = path.join(this.uploadDir, String(ano), mes);
    await fs.mkdir(diretorio, { recursive: true });

    const timestamp = Date.now();
    const nomeSeguro = this.normalizarNomeArquivo(arquivo.originalname);
    const nomeArquivo = `${timestamp}-${nomeSeguro}`;

    const caminhoCompleto = path.join(diretorio, nomeArquivo);

    await fs.copyFile(arquivo.path, caminhoCompleto);
    await fs.unlink(arquivo.path);

    return path
      .relative(this.uploadDir, caminhoCompleto)
      .replace(/\\/g, '/');
  }

  async deletarArquivo(caminho: string): Promise<void> {
    if (!caminho) return;

    const caminhoCompleto = path.join(this.uploadDir, caminho);

    try {
      await fs.unlink(caminhoCompleto);
    } catch {
      // silencioso por design
    }
  }

  obterUrlPublica(caminho: string): string {
    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      `http://localhost:${process.env.PORT || 3001}`;

    return `${baseUrl}/uploads/${caminho.replace(/\\/g, '/')}`;
  }

  validarTipoArquivo(mimetype: string): boolean {
    return this.tiposPermitidos.includes(mimetype);
  }

  validarTamanhoArquivo(tamanho: number): boolean {
    return tamanho <= this.maxFileSize;
  }

  private normalizarNomeArquivo(nome: string): string {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .toLowerCase();
  }
}
