// src/server.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { connectMongo } from './servicosTecnicos/database/mongo';
import rotas from './ui/rotas';
import { ErroMiddleware } from './ui/middlewares/erroMiddleware';

const app = express();

// Necessário para o Render (e qualquer proxy reverso)
// Permite que o express-rate-limit identifique o IP real do cliente
app.set('trust proxy', 1);

/* ===============================
 * Configurações básicas
 * =============================== */
const PORT: number = Number(process.env.PORT) || 3001;

/* ===============================
 * CORS – origens permitidas
 * =============================== */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:4321'];

/* ===============================
 * Segurança (Helmet)
 * =============================== */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "frame-ancestors": ["'self'", ...allowedOrigins],
        "img-src": ["'self'", "data:", "blob:", ...allowedOrigins],
      },
    },
  })
);

// Permite carregamento de arquivos entre domínios (para /uploads)
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

/* ===============================
 * CORS dinâmico
 * =============================== */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / curl, etc.

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`⚠️ Origin não permitida: ${origin}`);
      return callback(new Error('Origin não permitida pelo CORS'));
    },
    credentials: true,
  })
);

// Trata erro de CORS de forma amigável
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err?.message === 'Origin não permitida pelo CORS') {
      return res.status(403).json({ erro: err.message });
    }
    return next(err);
  }
);

/* ===============================
 * Rate Limiting
 * =============================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: '🚫 Muitas requisições, tente novamente mais tarde',
});

app.use(limiter);

/* ===============================
 * Middlewares globais
 * =============================== */
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
 * Arquivos estáticos (uploads)
 * =============================== */
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

/* ===============================
 * Rotas da API
 * =============================== */
app.use('/api', rotas);

/* ===============================
 * Rota raiz (health check)
 * =============================== */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'API Posto Padre Pio - ligacultural Marabá',
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

/* ===============================
 * Middleware de erro
 * =============================== */
app.use(ErroMiddleware.capturar);

/* ===============================
 * Criar diretórios necessários
 * =============================== */
async function criarDiretorios(): Promise<void> {
  const diretorios = [
    uploadsPath,
    path.join(uploadsPath, 'temp'),
  ];

  for (const dir of diretorios) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Diretório criado: ${dir}`);
    }
  }
}

/* ===============================
 * Inicialização da aplicação
 * =============================== */
async function iniciar(): Promise<void> {
  try {
    await criarDiretorios();

    // 🔹 Conexão com MongoDB
    await connectMongo();

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🐾 ========================================');
      console.log('🐾  liga cultural Marabá - API Backend');
      console.log('🐾 ========================================');
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Banco: MongoDB Atlas`);
      console.log(`🌐 CORS: ${allowedOrigins.join(', ')}`);
      console.log('🐾 ========================================');
      console.log('');
    });
  } catch (erro) {
    console.error('❌ Erro ao iniciar aplicação:', erro);
    process.exit(1);
  }
}

iniciar();