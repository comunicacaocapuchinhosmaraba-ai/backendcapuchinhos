// src/servicosTecnicos/repositorios/DocumentoRepositorio.ts
import { Repository } from 'typeorm';
import { Documento, StatusDocumento } from '@dominio/entidades/Documento';
import { IDocumentoRepositorio, FiltrosDocumento, ResultadoPaginado } from '@dominio/repositorios/IDocumentoRepositorio';
import { AppDataSource } from '../database/dataSource';

export class DocumentoRepositorio implements IDocumentoRepositorio {
  private repositorio: Repository<Documento>;

  constructor() {
    this.repositorio = AppDataSource.getRepository(Documento);
  }

  /* ===============================
   * CRIAR DOCUMENTO
   * =============================== */
  async criar(documento: Documento): Promise<Documento> {
    return await this.repositorio.save(documento);
  }

  /* ===============================
   * BUSCAR POR ID
   * =============================== */
  async buscarPorId(id: string): Promise<Documento | null> {
    return await this.repositorio.findOne({
      where: { id },
      relations: ['criadoPor']
    });
  }

  /* ===============================
   * LISTAR TODOS
   * =============================== */
  async listarTodos(filtros?: FiltrosDocumento): Promise<Documento[]> {
    const query = this.repositorio.createQueryBuilder('documento')
      .leftJoinAndSelect('documento.criadoPor', 'usuario')
      .orderBy('documento.criadoEm', 'DESC');

    if (filtros?.categoria) query.andWhere('documento.categoria = :categoria', { categoria: filtros.categoria });
    if (filtros?.status) query.andWhere('documento.status = :status', { status: filtros.status });
    if (filtros?.data) query.andWhere('documento.data = :data', { data: filtros.data });

    return await query.getMany();
  }

  /* ===============================
   * LISTAR ATIVOS
   * =============================== */
  async listarAtivos(filtros?: FiltrosDocumento): Promise<Documento[]> {
    return await this.listarTodos({ ...filtros, status: StatusDocumento.ATIVO });
  }

  /* ===============================
   * LISTAR PAGINADO
   * =============================== */
  async listarPaginado(
    pagina: number,
    limite: number,
    filtros?: FiltrosDocumento,
    busca?: string
  ): Promise<ResultadoPaginado> {
    const query = this.repositorio.createQueryBuilder('documento')
      .leftJoinAndSelect('documento.criadoPor', 'usuario')
      .orderBy('documento.criadoEm', 'DESC');

    if (filtros?.categoria) query.andWhere('documento.categoria = :categoria', { categoria: filtros.categoria });
    if (filtros?.status) query.andWhere('documento.status = :status', { status: filtros.status });
    if (filtros?.data) query.andWhere('documento.data = :data', { data: filtros.data });

    if (busca) {
      query.andWhere('(documento.titulo ILIKE :busca OR documento.nota ILIKE :busca)', { busca: `%${busca}%` });
    }

    const skip = (pagina - 1) * limite;
    query.skip(skip).take(limite);

    const [documentos, total] = await query.getManyAndCount();
    return { documentos, total };
  }

  /* ===============================
   * ATUALIZAR DOCUMENTO
   * =============================== */
  async atualizar(id: string, dados: Partial<Documento>): Promise<Documento> {
    await this.repositorio.update(id, dados);
    const documento = await this.buscarPorId(id);
    if (!documento) throw new Error('Documento não encontrado');
    return documento;
  }

  /* ===============================
   * DELETAR DOCUMENTO
   * =============================== */
  async deletar(id: string): Promise<void> {
    await this.repositorio.delete(id);
  }

  /* ===============================
   * CONTAR POR CATEGORIA (ATIVOS)
   * =============================== */
  async contarPorCategoria(): Promise<{ categoria: string; total: number }[]> {
    return await this.repositorio.createQueryBuilder('documento')
      .select('documento.categoria', 'categoria')
      .addSelect('COUNT(*)', 'total')
      .where('documento.status = :status', { status: StatusDocumento.ATIVO })
      .groupBy('documento.categoria')
      .getRawMany();
  }
}
