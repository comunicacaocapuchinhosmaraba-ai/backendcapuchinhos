import { Documento } from '@dominio/entidades/Documento';
import { IDocumentoRepositorio } from '@dominio/repositorios/IDocumentoRepositorio';

export class BuscarDocumentoUseCase {
  constructor(private documentoRepositorio: IDocumentoRepositorio) {}

  async executar(id: string): Promise<Documento> {
    const documento = await this.documentoRepositorio.buscarPorId(id);

    if (!documento) {
      throw new Error('Documento não encontrado');
    }

    return documento;
  }
}