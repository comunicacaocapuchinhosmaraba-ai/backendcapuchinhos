import { Documento, CategoriaDocumento } from '@dominio/entidades/Documento';
import { IDocumentoRepositorio } from '@dominio/repositorios/IDocumentoRepositorio';
import { IArmazenamentoServico, ArquivoUpload } from '@dominio/servicos/IArmazenamentoServico';

export interface CriarDocumentoDTO {
  titulo: string;
  categoria: CategoriaDocumento;
  nota?: string;
  data: string;
  arquivo: ArquivoUpload;
  criadoPorId: string;
}

export class CriarDocumentoUseCase {
  constructor(
    private documentoRepositorio: IDocumentoRepositorio,
    private armazenamentoServico: IArmazenamentoServico
  ) {}

  async executar(dados: CriarDocumentoDTO): Promise<Documento> {
    // valida tipo de arquivo
    if (!this.armazenamentoServico.validarTipoArquivo(dados.arquivo.mimetype)) {
      throw new Error('Tipo de arquivo não permitido. Use PDF, DOC, DOCX ou imagens.');
    }

    // valida tamanho do arquivo
    if (!this.armazenamentoServico.validarTamanhoArquivo(dados.arquivo.size)) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
    }

    // salva fisicamente e obtém o caminho relativo (ex.: "2026/02/arquivo.png")
    const caminhoArquivo = await this.armazenamentoServico.salvarArquivo(dados.arquivo);

    // monta URL pública completa (ex.: "http://localhost:3001/uploads/2026/02/arquivo.png")
    const urlPublica = this.armazenamentoServico.obterUrlPublica(caminhoArquivo);

    const documento = new Documento({
      titulo: dados.titulo,
      categoria: dados.categoria,
      nota: dados.nota,
      data: dados.data,
      nomeArquivo: dados.arquivo.originalname,
      caminhoArquivo: caminhoArquivo,
      tipoArquivo: dados.arquivo.mimetype,
      tamanhoArquivo: dados.arquivo.size,
      urlPublica: urlPublica,
      criadoPorId: dados.criadoPorId,
    });

    return await this.documentoRepositorio.criar(documento);
  }
}
