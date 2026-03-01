// src/ui/rotas/index.ts
import { Router, Request, Response } from 'express';
import autenticacaoRotas from './autenticacaoRotas';
import documentoRotas from './documentoRotas';
import demandaRotas from './demandaRotas';

const router = Router();

/**
 * Rotas de demanda
 * Ex.: POST /demanda
 */
router.use('/demanda', demandaRotas);

/**
 * Rotas de autenticação
 * Ex.: /auth/login, /auth/logout
 */
router.use('/auth', autenticacaoRotas);

/**
 * Rotas de documentos
 * Ex.: /documentos/publicos
 */
router.use('/documentos', documentoRotas);

/**
 * Debug endpoint - REMOVER DEPOIS
 */
router.get('/debug-docs', async (_req: Request, res: Response) => {
  try {
    const mongoose = await import('mongoose');
    const db = mongoose.default.connection.db;
    if (!db) {
      res.json({ erro: 'DB não conectado' });
      return;
    }
    const docs = await db.collection('documentos').find({}).toArray();
    res.json({ total: docs.length, docs: docs.slice(0, 3) });
  } catch (e: any) {
    res.json({ erro: e.message });
  }
});

/**
 * Documentos públicos direto via MongoDB (bypass Mongoose model)
 */
router.get('/documentos/publicos-v2', async (_req: Request, res: Response) => {
  try {
    const mongoose = await import('mongoose');
    const db = mongoose.default.connection.db;
    if (!db) {
      res.json({ documentos: [], total: 0 });
      return;
    }
    const docs = await db.collection('documentos')
      .find({ status: 'ativo' })
      .sort({ criadoEm: -1 })
      .toArray();
    const documentos = docs.map((d: any) => ({
      id: d._id.toString(),
      titulo: d.titulo,
      categoria: d.categoria,
      nota: d.nota,
      data: d.data,
      tipoArquivo: d.tipoArquivo,
      tamanhoArquivo: d.tamanhoArquivo,
      urlPublica: d.urlPublica,
      criadoEm: d.criadoEm,
    }));
    res.json({ documentos, total: documentos.length });
  } catch (e: any) {
    res.json({ erro: e.message });
  }
});

/**
 * Health check da API
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * Middleware genérico para rotas não encontradas
 */
router.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Rota não encontrada',
    timestamp: new Date().toISOString(),
  });
});

export default router;