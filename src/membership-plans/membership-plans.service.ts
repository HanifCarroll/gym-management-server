import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '../utils';
import {
  DbMembershipPlan,
  MembershipPlan,
} from './entities/membership-plan.entity';

@Injectable()
export class MembershipPlansService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    const snakeCaseDto = camelToSnakeCase(
      createMembershipPlanDto,
    ) as DbMembershipPlan;
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .insert(snakeCaseDto)
      .select()
      .single();

    if (error) throw error;

    return transformSupabaseResultToCamelCase<MembershipPlan>(data);
  }

  async findAll(): Promise<MembershipPlan[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .select('*');

    if (error) throw error;

    return transformSupabaseResultToCamelCase<MembershipPlan[]>(data);
  }

  async findOne(id: string): Promise<MembershipPlan> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return transformSupabaseResultToCamelCase<MembershipPlan>(data);
  }

  async update(
    id: string,
    updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    const snakeCaseDto = camelToSnakeCase(updateMembershipPlanDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .update(snakeCaseDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return transformSupabaseResultToCamelCase<MembershipPlan>(data);
  }

  async remove(id: string): Promise<MembershipPlan> {
    const client = this.supabaseService.getClient();

    // First, delete associated memberships
    const { error: membershipDeleteError } = await client
      .from('membership')
      .delete()
      .eq('plan_id', id);

    if (membershipDeleteError) {
      throw new InternalServerErrorException(
        'Error deleting associated memberships',
        membershipDeleteError.message,
      );
    }

    // Then, delete the membership plan
    const { data, error } = await client
      .from('membership_plan')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(
          `Membership plan with ID "${id}" not found`,
        );
      }
      throw new InternalServerErrorException(
        'Error deleting membership plan',
        error.message,
      );
    }

    if (!data) {
      throw new NotFoundException(`Membership plan with ID "${id}" not found`);
    }

    return transformSupabaseResultToCamelCase<MembershipPlan>(data);
  }
}
