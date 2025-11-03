import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'oracle',
  host: process.env.ORACLE_HOST,
  port: Number(process.env.ORACLE_PORT) || 1521,
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  sid: process.env.ORACLE_SID,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});
