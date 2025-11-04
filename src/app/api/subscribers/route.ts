import { NextRequest, NextResponse } from "next/server";
import { SubscribeData } from "@/interfaces/subscribe.interface";
import { validateEmail } from "@/validators/types/email.type-validator";
import { validateName } from "@/validators/types/name.type-validator";
import { validateGender } from "@/validators/types/gender.type-validator";
import { ValidatorField } from "@/interfaces/validator.interface";
import { validateFormData } from "@/validators/validator";
import { getDataSource } from "@/db/data-source";
import { Subscribers } from "@/db/entities/subscribers.entity";
import { basicAuth } from '@/app/api/(auth)/basic.auth';
import { generateSubscribersCSV } from "./(helpers)/generate-subscribers-csv.helper";

export async function GET(req: NextRequest) {
  try {
    basicAuth(req);

    const db = await getDataSource();
    const subscriberRepository = db.getRepository(Subscribers);
    const subscribers = await subscriberRepository.find({
      order: { updatedAt: 'DESC' }
    });

    const csvData = generateSubscribersCSV(subscribers);
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `subscribers_${currentDate}_${Math.random().toString(36).substring(2, 15)}.csv`;

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

export async function POST(req: NextRequest) {
  try {
    const data: SubscribeData = await req.json();
    const fields: Array<ValidatorField<SubscribeData>> = [
      { key: "name", label: "Name", validator: validateName, required: true },
      { key: "email", label: "Email", validator: validateEmail, required: true },
      { key: "gender", label: "Gender", validator: validateGender, required: true },
    ];

    const { valid, errors } = validateFormData<SubscribeData>(data, fields);
    if (!valid) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const db = await getDataSource();

    const repository = db.getRepository(Subscribers);

    await repository.upsert(data, ['email']);

    return NextResponse.json({
      success: true,
      message: 'Subscriber salvo com sucesso! (criado ou atualizado)'
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao criar subscriber:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
