export class CreateClassDto {
  className: string;
  dayOfWeek: number;
  description?: string;
  endDate?: string;
  startDate?: string;
  instructorId: string;
  maxCapacity: number;
  startTime: string;
  endTime: string;
}
