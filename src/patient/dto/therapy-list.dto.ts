import { MedicineDto } from './medicine.dto';

export class TherapyListDto {
  therapy_listID: number;
  name: string;
  Medicine_IDmedicine: number;
  Dosage: string;
  medicines: MedicineDto[];
}
