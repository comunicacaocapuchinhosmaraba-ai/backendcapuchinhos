import { IDocumentoRepositorio } from '@dominio/repositorios/IDocumentoRepositorio';
import { IArmazenamentoServico } from '@dominio/servicos/IArmazenamentoServico';

export class DeletarDocumentoUseCase {
  constructor(
    private documentoRepositorio: IDocumentoRepositorio,
    private armazenamentoServico: IArmazenamentoServico
  ) {}

  async executar(id: string): Promise<void> {
    const documento = await this.documentoRepositorio.buscarPorId(id);

    if (!documento) {
      throw new Error('Documento não encontrado');
    }

    await this.armazenamentoServico.deletarArquivo(documento.caminhoArquivo);
    await this.documentoRepositorio.deletar(id);
  }
}