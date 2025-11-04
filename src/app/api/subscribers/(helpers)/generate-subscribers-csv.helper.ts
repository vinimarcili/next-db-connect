import { Subscribers } from "@/db/entities/subscribers.entity";
import { CSVColumnConfig } from "@/interfaces/csv.interface";
import { generateCSV } from "@/utils/generate-csv.util";

export function generateSubscribersCSV(subscribers: Subscribers[]): string {
  const columns: CSVColumnConfig<Subscribers>[] = [
    { header: 'ID', key: 'id', type: 'number' },
    { header: 'Nome', key: 'name', type: 'string' },
    { header: 'E-mail', key: 'email', type: 'string' },
    { header: 'Gênero', key: 'gender', type: 'string' },
    { header: 'Data Criação', key: 'createdAt', type: 'date' },
    { header: 'Data Atualização', key: 'updatedAt', type: 'date' }
  ];

  return generateCSV<Subscribers>(subscribers, columns);
}