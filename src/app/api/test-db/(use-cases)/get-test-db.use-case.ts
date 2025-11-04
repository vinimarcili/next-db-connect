import { getDataSource } from "@/db/data-source";
import { NextResponse } from "next/server";

export async function getTestDB() {
  try {
    console.log('🔧 Testando conexão com PostgreSQL/Supabase usando TypeORM...');

    const db = await getDataSource();
    console.log('🔗 Conexão com PostgreSQL estabelecida com sucesso.');

    await db.query('SELECT 1 as test, NOW() as current_time');

    console.log('✅ Query executada com sucesso');

    return NextResponse.json({
      success: true,
      message: 'Conexão com PostgreSQL/Supabase estabelecida com sucesso!',
      database: 'PostgreSQL/Supabase',
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