import { Documento } from '@dominio/entidades/Documento';
import { IDocumentoRepositorio } from '@dominio/repositorios/IDocumentoRepositorio';

export interface AtualizarDocumentoDTO {
  id: string;
  titulo?: string;
  nota?: string;
  status?: string;
}

export class AtualizarDocumentoUseCase {
  constructor(private documentoRepositorio: IDocumentoRepositorio) {}

  async executar(dados: AtualizarDocumentoDTO): Promise<Documento> {
    const documento = await this.documentoRepositorio.buscarPorId(dados.id);

    if (!documento) {
      throw new Error('Documento não encontrado');
    }

    return await this.documentoRepositorio.atualizar(dados.id, {
      titulo: dados.titulo,
      nota: dados.nota,
      status: dados.status as any
    });
  }
}