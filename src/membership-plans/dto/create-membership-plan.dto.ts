import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMembershipPlanDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  duration: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
