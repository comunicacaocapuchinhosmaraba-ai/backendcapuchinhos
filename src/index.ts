import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { AppDataSource } from './servicosTecnicos/database/dataSource';
import rotas from './ui/rotas';
import { ErroMiddleware } from './ui/middlewares/erroMiddleware';


const app = express();

// 🔹 Porta segura
const PORT: number = Number(process.env.PORT) || 3001;

// ✅ Configuração de origens permitidas (CORS)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:4321'];

/* ===============================
 * Middlewares de segurança
 * =============================== */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "frame-ancestors": [
          "'self'",
          ...allowedOrigins
        ],
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", ...allowedOrigins],
      },
    },
  })
);

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// ✅ CORS com múltiplas origens
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (Postman, curl, etc)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ Origin não permitida: ${origin}`);
        callback(new Error('Origin não permitida pelo CORS'));
      }
    },
    credentials: true,
  })
);

/* ===============================
 * Rate limiting
 * =============================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '🚫 Muitas requisições, tente novamente mais tarde',
});
app.use('/api', limiter);

/* ===============================
 * Middlewares gerais
 * =============================== */
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
 * Arquivos estáticos
 * =============================== */
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

/* ===============================
 * Rotas da API
 * =============================== */
app.use('/api', rotas);

/* ===============================
 * Rota raiz de teste
 * =============================== */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Patinhas de Rua Marabá',
    version: '1.0.0',
    status: 'online',
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
  const diretorios = [uploadsPath, path.join(uploadsPath, 'temp')];

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

    await AppDataSource.initialize();
    console.log('✅ Banco de dados conectado');

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🐾 ========================================');
      console.log('🐾  Patinhas de Rua Marabá - API Backend');
      console.log('🐾 ========================================');
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(
        `🗄️  Banco: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
      );
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