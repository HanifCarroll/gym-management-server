export class CreateMemberDto {
  name: string;
  email: string;
  phone: string;
  address?: string;
  membership_plan_id: number;
}
