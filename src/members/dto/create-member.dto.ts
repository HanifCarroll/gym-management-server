export class CreateMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  membershipPlanId: number;
}
