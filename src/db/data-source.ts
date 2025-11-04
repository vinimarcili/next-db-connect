import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Subscribers } from './entities/subscribers.entity';
import { getOracleWalletManager, OracleWalletManager } from '@/utils/oracle-wallet.util';

export const AppDataSource = new DataSource({
  type: 'oracle',
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  // Configuração mTLS com wallet Oracle
  connectString: process.env.ORACLE_CONNECTION_STRING || `(description= (retry_count=${process.env.ORACLE_RETRY_COUNT || 20})(retry_delay=${process.env.ORACLE_RETRY_DELAY || 3})(address=(protocol=tcps)(port=${process.env.ORACLE_PORT})(host=${process.env.ORACLE_HOST}))(connect_data=(service_name=${process.env.ORACLE_SERVICE_NAME}))(security=(ssl_server_dn_match=yes)))`,
  // Opções extras para Oracle - incluindo configurações mTLS
  extra: {
    // Configurações mTLS
    ...(process.env.ORACLE_WALLET_LOCATION && {
      walletLocation: process.env.ORACLE_WALLET_LOCATION,
      walletPassword: process.env.ORACLE_WALLET_PASSWORD,
    }),
    // Configurações SSL/TLS
    ...(process.env.ORACLE_SSL_CA && {
      ssl: {
        ca: process.env.ORACLE_SSL_CA,
        cert: process.env.ORACLE_SSL_CERT,
        key: process.env.ORACLE_SSL_KEY,
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      }
    }),
    // Configurações de conexão
    connectTimeout: parseInt(process.env.ORACLE_CONNECT_TIMEOUT || '60000'),
    poolTimeout: parseInt(process.env.ORACLE_POOL_TIMEOUT || '60000'),
    poolMin: parseInt(process.env.ORACLE_POOL_MIN || '1'),
    poolMax: parseInt(process.env.ORACLE_POOL_MAX || '10'),
    poolIncrement: parseInt(process.env.ORACLE_POOL_INCREMENT || '1'),
  },
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Subscribers],
});

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    // Verifica se deve usar mTLS
    const validation = OracleWalletManager.validateEnvironment();

    if (validation.isValid) {
      console.log('🔐 Using mTLS with Oracle Wallet');

      // Configura wallet se necessário
      const walletManager = await getOracleWalletManager();
      const walletLocation = walletManager.getWalletLocation();

      // Recria o DataSource com configurações mTLS
      const newOptions = {
        ...AppDataSource.options,
        connectString: process.env.ORACLE_CONNECTION_STRING,
        extra: {
          ...AppDataSource.options.extra,
          walletLocation,
          walletPassword: process.env.ORACLE_WALLET_PASSWORD,
        }
      };

      // Atualiza as opções do DataSource
      Object.assign(AppDataSource.options, newOptions);

      console.log(`📂 Wallet location: ${walletLocation}`);
    } else {
      console.log('🌐 Using standard TCP connection');
      if (validation.missing.length > 0) {
        console.log('⚠️  Missing mTLS variables:', validation.missing);
      }
    }

    await AppDataSource.initialize();
  }
  return AppDataSource;
}