import { NextRequest, NextResponse } from "next/server";
import { SubscribeData } from "@/interfaces/subscribe";
import { validateEmail } from "@/validators/types/email";
import { validateName } from "@/validators/types/name";
import { validateGender } from "@/validators/types/gender";
import { ValidatorField } from "@/interfaces/validator";
import { validateFormData } from "@/validators/validator";
import { getDataSource } from "@/db/data-source";
import { Subscribers } from "@/db/entities/subscribers.entity";

function authenticateAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  return username === adminUsername && password === adminPassword;
}

function generateCSV(subscribers: Subscribers[]): string {
  const headers = ['ID', 'Nome', 'Email', 'Gênero', 'Data Criação', 'Data Atualização'];
  const csvRows = [headers.join(',')];

  subscribers.forEach(subscriber => {
    const row = [
      subscriber.id,
      `"${subscriber.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
      `"${subscriber.email.replace(/"/g, '""')}"`,
      `"${subscriber.gender || ''}"`,
      subscriber.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      subscriber.updatedAt.toISOString().split('T')[0]
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    if (!authenticateAdmin(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid credentials' },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"'
          }
        }
      );
    }

    const db = await getDataSource();
    const subscriberRepository = db.getRepository(Subscribers);
    const subscribers = await subscriberRepository.find({
      order: { updatedAt: 'DESC' }
    });

    // Gerar CSV
    const csvData = generateCSV(subscribers);
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `subscribers_${currentDate}.csv`;

    // Retornar CSV como download
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
