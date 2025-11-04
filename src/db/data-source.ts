import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Subscribers } from './entities/subscribers.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: false,
  synchronize: false,
  logging: true,
  entities: [Subscribers],
  extra: {
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  },
});

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    try {
      console.log('🔧 Conectando ao PostgreSQL');
      await AppDataSource.initialize();
      console.log('✅ Conexão PostgreSQL estabelecida com sucesso!');
    } catch (error) {
      throw error;
    }
  }
  return AppDataSource;
}