import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuração de armazenamento dos arquivos
const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    // Define pasta temporária para uploads
    cb(null, 'uploads/temp');
  },
  filename: (_req: Request, file, cb) => {
    // Gera um nome único para cada arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Configuração do multer
export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB padrão
  },
  fileFilter: (_req: Request, file, cb) => {
    // Aceita apenas arquivos PDF, imagens ou DOCX (exemplo)
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      return cb(new Error('Tipo de arquivo não permitido'));
    }
    cb(null, true);
  },
});
