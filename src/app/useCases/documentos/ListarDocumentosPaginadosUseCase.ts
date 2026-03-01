import { Documento } from '@dominio/entidades/Documento';
import { IDocumentoRepositorio, FiltrosDocumento } from '@dominio/repositorios/IDocumentoRepositorio';

export interface PaginacaoParams {
  pagina: number;
  limite: number;
  filtros?: FiltrosDocumento;
  busca?: string;
}

export interface ResultadoPaginado {
  documentos: Documento[];
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
}

export class ListarDocumentosPaginadosUseCase {
  constructor(private documentoRepositorio: IDocumentoRepositorio) {}

  async executar(params: PaginacaoParams): Promise<ResultadoPaginado> {
    const { pagina = 1, limite = 10, filtros, busca } = params;
    
    const resultado = await this.documentoRepositorio.listarPaginado(
      pagina,
      limite,
      filtros,
      busca
    );

    return {
      documentos: resultado.documentos,
      total: resultado.total,
      pagina,
      totalPaginas: Math.ceil(resultado.total / limite),
      limite
    };
  }
}