import { getDataSource } from "@/db/data-source";
import { Subscribers } from "@/db/entities/subscribers.entity";
import { SubscribeData } from "@/interfaces/subscribe.interface";
import { ValidatorField } from "@/interfaces/validator.interface";
import { validateEmail } from "@/validators/types/email.type-validator";
import { validateGender } from "@/validators/types/gender.type-validator";
import { validateName } from "@/validators/types/name.type-validator";
import { validateFormData } from "@/validators/validator";
import { NextRequest, NextResponse } from "next/server";

export async function postSubscriber(req: NextRequest) {
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