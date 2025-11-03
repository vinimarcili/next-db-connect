import { NextRequest, NextResponse } from "next/server";
import { SubscribeData } from "@/interfaces/subscribe";
import { validateEmail } from "@/validators/types/email";
import { validateName } from "@/validators/types/name";
import { validateGender } from "@/validators/types/gender";
import { ValidatorField } from "@/interfaces/validator";
import { validateFormData } from "@/validators/validator";

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

    // TODO: Process the valid subscription data (e.g., save to database)

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
