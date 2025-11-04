import { getDataSource } from "@/db/data-source";
import { OracleWalletManager } from "@/utils/oracle-wallet.util";
import { NextResponse } from "next/server";

export async function getTestDB(requestIp?: string) {
  try {
    console.log('🔧 Testando conexão com Oracle usando TypeORM...');

    // Verifica configuração mTLS
    const validation = OracleWalletManager.validateEnvironment();
    const usingMTLS = validation.isValid;

    console.log(`🔐 Método de conexão: ${usingMTLS ? 'mTLS (Wallet)' : 'TCP padrão'}`);

    const db = await getDataSource();
    console.log('🔗 Conexão com Oracle estabelecida com sucesso.');

    // Testa query básica
    const testResult = await db.query('SELECT 1 as TEST FROM DUAL');

    // Query adicional para informações do banco
    const dbInfo = await db.query(`
      SELECT 
        SYS_CONTEXT('USERENV', 'DB_NAME') as DB_NAME,
        SYS_CONTEXT('USERENV', 'SERVER_HOST') as SERVER_HOST,
        SYS_CONTEXT('USERENV', 'SESSION_USER') as SESSION_USER,
        TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') as SERVER_TIME
      FROM DUAL
    `);

    console.log('✅ Query executada com sucesso:', testResult);
    console.log('ℹ️  Informações do banco:', dbInfo);

    return NextResponse.json({
      success: true,
      message: 'Conexão com Oracle estabelecida com sucesso!',
      connectionMethod: usingMTLS ? 'mTLS (Wallet)' : 'TCP',
      data: {
        test: testResult,
        dbInfo: dbInfo[0],
      },
      requestIp: requestIp || 'unknown',
      missingMTLSVars: validation.missing,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Erro na conexão Oracle:', error);

    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar com Oracle',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      requestIp: requestIp || 'unknown',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}