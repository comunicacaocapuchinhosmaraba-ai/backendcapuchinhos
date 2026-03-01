import mongoose from 'mongoose';

/**
 * Obtém a URI do MongoDB de forma segura
 */
function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('❌ MONGODB_URI não definida nas variáveis de ambiente');
  }

  return uri;
}

/**
 * Conecta ao MongoDB Atlas
 */
export async function connectMongo(): Promise<void> {
  try {
    const mongoUri = getMongoUri();

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
}