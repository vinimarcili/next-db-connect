import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Utilitário para gerenciar Oracle Wallet em runtime
 * Converte certificados Base64 para arquivos temporários
 */
export class OracleWalletManager {
  private walletDir: string;

  constructor() {
    // Cria diretório temporário para o wallet
    this.walletDir = path.join(os.tmpdir(), 'oracle_wallet_' + Date.now());
  }

  /**
   * Cria wallet temporário a partir das variáveis de ambiente Base64
   * 
   * 🔄 PROCESSO:
   * 1. Lê variáveis Base64 do ambiente (Vercel ou .env.local)
   * 2. Converte Base64 de volta para arquivos binários 
   * 3. Cria arquivos temporários na pasta /tmp
   * 4. Oracle usa esses arquivos para mTLS
   * 5. Arquivos são apagados quando processo termina
   * 
   * ✅ SEGURANÇA: Arquivos originais nunca ficam no Git!
   */
  async setupWallet(): Promise<string> {
    try {
      console.log('🔐 Setting up Oracle Wallet from Base64 environment variables...');

      // Cria diretório temporário do wallet
      if (!fs.existsSync(this.walletDir)) {
        fs.mkdirSync(this.walletDir, { recursive: true });
        console.log(`📁 Created temporary wallet directory: ${this.walletDir}`);
      }

      // Lista de arquivos do wallet para reconstruir
      const walletFiles = [
        { env: 'ORACLE_CWALLET_SSO_B64', filename: 'cwallet.sso', description: 'Client Wallet (SSO)' },
        { env: 'ORACLE_EWALLET_P12_B64', filename: 'ewallet.p12', description: 'Enterprise Wallet (P12)' },
        { env: 'ORACLE_TNSNAMES_B64', filename: 'tnsnames.ora', description: 'TNS Names Configuration' },
        { env: 'ORACLE_SQLNET_B64', filename: 'sqlnet.ora', description: 'SQL*Net Configuration' },
      ];

      let filesCreated = 0;

      // Reconstrói cada arquivo a partir do Base64
      for (const file of walletFiles) {
        const base64Content = process.env[file.env];
        if (base64Content) {
          try {
            // Converte Base64 de volta para binário
            const binaryContent = Buffer.from(base64Content, 'base64');
            const filePath = path.join(this.walletDir, file.filename);

            // Escreve arquivo temporário
            fs.writeFileSync(filePath, binaryContent);

            console.log(`✅ ${file.description} reconstructed: ${file.filename} (${binaryContent.length} bytes)`);
            filesCreated++;
          } catch (error) {
            console.error(`❌ Error reconstructing ${file.filename}:`, error);
          }
        } else {
          console.warn(`⚠️  Missing environment variable: ${file.env}`);
          console.log(`   💡 Add this to .env.local or Vercel environment variables`);
        }
      }

      if (filesCreated === 0) {
        throw new Error('No wallet files could be created from environment variables');
      }

      console.log(`🔐 Oracle Wallet setup completed: ${filesCreated}/${walletFiles.length} files created`);
      console.log(`📂 Wallet location: ${this.walletDir}`);
      console.log(`🔒 Files will be automatically cleaned up on process exit`);

      return this.walletDir;

    } catch (error) {
      console.error('❌ Error setting up Oracle Wallet:', error);
      throw error;
    }
  }

  /**
   * Limpa arquivos temporários do wallet
   */
  cleanup(): void {
    try {
      if (fs.existsSync(this.walletDir)) {
        fs.rmSync(this.walletDir, { recursive: true, force: true });
        console.log(`🧹 Wallet cleanup completed: ${this.walletDir}`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up wallet:', error);
    }
  }

  /**
   * Retorna o caminho do diretório do wallet
   */
  getWalletLocation(): string {
    return this.walletDir;
  }

  /**
   * Verifica se todas as variáveis necessárias estão definidas
   */
  static validateEnvironment(): { isValid: boolean; missing: string[] } {
    const requiredVars = [
      'ORACLE_USER',
      'ORACLE_PASSWORD',
      'ORACLE_CONNECTION_STRING',
      'ORACLE_WALLET_PASSWORD',
      'ORACLE_CWALLET_SSO_B64',
      'ORACLE_EWALLET_P12_B64',
      'ORACLE_TNSNAMES_B64',
      'ORACLE_SQLNET_B64',
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    return {
      isValid: missing.length === 0,
      missing,
    };
  }
}

/**
 * Singleton instance para reutilizar o mesmo wallet
 */
let walletManagerInstance: OracleWalletManager | null = null;

export async function getOracleWalletManager(): Promise<OracleWalletManager> {
  if (!walletManagerInstance) {
    walletManagerInstance = new OracleWalletManager();
    await walletManagerInstance.setupWallet();

    // Cleanup quando o processo termina
    process.on('exit', () => {
      walletManagerInstance?.cleanup();
    });

    process.on('SIGINT', () => {
      walletManagerInstance?.cleanup();
      process.exit();
    });
  }

  return walletManagerInstance;
}