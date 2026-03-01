import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from '../../dominio/entidades/Usuario';
import { Documento } from '../../dominio/entidades/Documento';

export const AppDataSource = new DataSource({
  type: 'postgres',

  ...(process.env.DATABASE_URL
    ? {
        // 🔹 Produção (Render / Supabase)
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        // 🔹 Desenvolvimento local
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: false,
      }),

  synchronize: false,
  logging: false,
  entities: [Usuario, Documento],
});