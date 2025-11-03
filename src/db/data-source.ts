import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Subscribers } from './entities/subscribers.entity';

export const AppDataSource = new DataSource({
  type: 'oracle',
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `(description= (retry_count=${process.env.ORACLE_RETRY_COUNT || 20})(retry_delay=${process.env.ORACLE_RETRY_DELAY || 3})(address=(protocol=tcps)(port=${process.env.ORACLE_PORT})(host=${process.env.ORACLE_HOST}))(connect_data=(service_name=${process.env.ORACLE_SERVICE_NAME}))(security=(ssl_server_dn_match=yes)))`,
  synchronize: false,
  logging: true,
  entities: [Subscribers],
});

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}