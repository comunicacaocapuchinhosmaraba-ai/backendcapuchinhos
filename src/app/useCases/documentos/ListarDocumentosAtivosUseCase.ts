import { Documento } from '@dominio/entidades/Documento';
import { IDocumentoRepositorio, FiltrosDocumento } from '@dominio/repositorios/IDocumentoRepositorio';

export class ListarDocumentosAtivosUseCase {
  constructor(private documentoRepositorio: IDocumentoRepositorio) {}

  async executar(filtros?: FiltrosDocumento): Promise<Documento[]> {
    return await this.documentoRepositorio.listarAtivos(filtros);
  }
}