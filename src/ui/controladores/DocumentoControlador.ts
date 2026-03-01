// src/ui/controladores/DocumentoControlador.ts (apenas o método criar)
import { Response } from 'express';
import { RequestAutenticado } from '../middlewares/autenticacaoMiddleware';
import { CriarDocumentoUseCase } from '@app/useCases/documentos/CriarDocumentoUseCase';
import { ListarDocumentosUseCase } from '@app/useCases/documentos/ListarDocumentosUseCase';
import { AtualizarDocumentoUseCase } from '@app/useCases/documentos/AtualizarDocumentoUseCase';
import { DeletarDocumentoUseCase } from '@app/useCases/documentos/DeletarDocumentoUseCase';
import { DocumentoRepositorio } from '@servicosTecnicos/repositorios/DocumentoRepositorio';
import { ArmazenamentoServico } from '@servicosTecnicos/servicos/ArmazenamentoServico';
import type { CategoriaDocumento, StatusDocumento } from '@dominio/entidades/Documento';
import { Documento } from '@dominio/entidades/Documento';

export class DocumentoControlador {
  async criar(req: RequestAutenticado, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ erro: 'Arquivo é obrigatório' });

      const { titulo, categoria, nota, data } = req.body;

      if (!titulo || !categoria || !data) {
        return res.status(400).json({ erro: 'Título, categoria e data são obrigatórios' });
      }

      const documentoRepositorio = new DocumentoRepositorio();
      const armazenamentoServico = new ArmazenamentoServico();
      const criarDocumentoUseCase = new CriarDocumentoUseCase(
        documentoRepositorio,
        armazenamentoServico
      );

      const documento = await criarDocumentoUseCase.executar({
        titulo,
        categoria: categoria as CategoriaDocumento,
        nota,
        data,
        arquivo: req.file as any,
        criadoPorId: req.usuario!.usuarioId,
      });

      return res.status(201).json(documento);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  // ...demais métodos permanecem como na última versão que você enviou
}
