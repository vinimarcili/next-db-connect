import { NextResponse } from "next/server";
import { getDataSource } from "@/db/data-source";

export async function GET() {
  try {
    console.log('🔧 Testando conexão com Oracle usando TypeORM...');

    const db = await getDataSource();
    console.log('🔗 Conexão com Oracle estabelecida com sucesso.');
    const result = await db.query('SELECT 1 as TEST FROM DUAL');
    console.log('✅ Query executada com sucesso:', result);

    return NextResponse.json({
      success: true,
      message: 'Conexão com Oracle estabelecida com sucesso!',
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Erro na conexão Oracle:', error);

    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar com Oracle',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}