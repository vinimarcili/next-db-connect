import { getDataSource } from "@/db/data-source";
import { basicAuth } from "../../(auth)/basic.auth";
import { Subscribers } from "@/db/entities/subscribers.entity";
import { generateSubscribersCSV } from "../(helpers)/generate-subscribers-csv.helper";
import { generateFileName } from "@/utils/generate-file-name.util";
import { NextRequest, NextResponse } from "next/server";

export async function getSubscribersCSV(req: NextRequest) {
  try {
    basicAuth(req);

    const db = await getDataSource();
    const subscriberRepository = db.getRepository(Subscribers);
    const subscribers = await subscriberRepository.find({
      order: { updatedAt: 'DESC' }
    });

    const csvData = generateSubscribersCSV(subscribers);
    const filename = generateFileName('subscribers', 'csv');

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar subscribers:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}