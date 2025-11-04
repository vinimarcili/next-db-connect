import { getDataSource } from "@/db/data-source";
import { NextResponse } from "next/server";

export async function getTestDB() {
  try {
    console.log('🔧 Testando conexão com PostgreSQL/Supabase usando TypeORM...');

    const db = await getDataSource();
    console.log('🔗 Conexão com PostgreSQL estabelecida com sucesso.');

    const testResult = await db.query('SELECT 1 as test, NOW() as current_time');

    const dbInfo = await db.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `);


    console.log('✅ Queries executadas com sucesso');
    console.log('ℹ️  Informações do banco:', dbInfo[0]);

    return NextResponse.json({
      success: true,
      message: 'Conexão com PostgreSQL/Supabase estabelecida com sucesso!',
      database: 'PostgreSQL/Supabase',
      data: {
        test: testResult[0],
        dbInfo: dbInfo[0],
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Erro na conexão PostgreSQL:', error);

    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar com PostgreSQL/Supabase',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}