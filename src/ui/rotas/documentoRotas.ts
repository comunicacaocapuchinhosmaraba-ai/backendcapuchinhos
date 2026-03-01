// src/ui/rotas/documentoRotas.ts
import { Router, Request, Response } from 'express';
import { DocumentoControlador } from '../controladores/DocumentoControlador';
import { AutenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';
import { upload } from '../../servicosTecnicos/uploads/multerConfig';

const router = Router();
const controlador = new DocumentoControlador();
const authMiddleware = new AutenticacaoMiddleware();

/* ===============================
 * ROTAS PÚBLICAS
 * =============================== */

/**
 * Lista todos os documentos públicos ativos
 * GET /documentos/publicos
 */
router.get('/publicos', (req: Request, res: Response) =>
  controlador.listarAtivos(req as any, res)
);

/**
 * Busca documento público por ID
 * GET /documentos/publicos/:id
 */
router.get('/publicos/:id', (req: Request, res: Response) =>
  controlador.buscarPorId(req as any, res)
);

/**
 * Download de documento público
 * GET /documentos/publicos/:id/download
 */
router.get('/publicos/:id/download', (req: Request, res: Response) =>
  controlador.download(req as any, res)
);

/* ===============================
 * ROTAS PROTEGIDAS (Requer autenticação)
 * =============================== */
router.use(authMiddleware.verificar);

/**
 * Criar novo documento com upload de arquivo
 * POST /documentos
 */
router.post(
  '/',
  upload.single('arquivo'), // multer middleware
  (req: Request, res: Response) => controlador.criar(req as any, res)
);

/**
 * Listagem paginada de documentos (admin)
 * GET /documentos/paginado
 */
router.get('/paginado', (req: Request, res: Response) =>
  controlador.listarPaginado(req as any, res)
);

/**
 * Buscar documento por ID (admin)
 * GET /documentos/:id
 */
router.get('/:id', (req: Request, res: Response) =>
  controlador.buscarPorId(req as any, res)
);

/**
 * Listar todos os documentos (admin)
 * GET /documentos
 */
router.get('/', (req: Request, res: Response) =>
  controlador.listarTodos(req as any, res)
);

/**
 * Atualizar documento por ID
 * PUT /documentos/:id
 */
router.put('/:id', (req: Request, res: Response) =>
  controlador.atualizar(req as any, res)
);

/**
 * Deletar documento por ID
 * DELETE /documentos/:id
 */
router.delete('/:id', (req: Request, res: Response) =>
  controlador.deletar(req as any, res)
);

export default router;
