import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '../utils';

@Injectable()
export class MembershipPlansService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createMembershipPlanDto: CreateMembershipPlanDto) {
    const snakeCaseDto = camelToSnakeCase(createMembershipPlanDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .insert(snakeCaseDto)
      .select()
      .single();

    if (error) throw error;
    return transformSupabaseResultToCamelCase(data);
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .select('*');

    if (error) throw error;
    return transformSupabaseResultToCamelCase(data);
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformSupabaseResultToCamelCase(data);
  }

  async update(id: string, updateMembershipPlanDto: UpdateMembershipPlanDto) {
    const snakeCaseDto = camelToSnakeCase(updateMembershipPlanDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .update(snakeCaseDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformSupabaseResultToCamelCase(data);
  }

  async remove(id: string) {
    const client = this.supabaseService.getClient();

    try {
      // First, delete associated memberships
      const { error: membershipDeleteError } = await client
        .from('membership')
        .delete()
        .eq('plan_id', id);
      if (membershipDeleteError) throw membershipDeleteError;

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
        throw error;
      }

      if (!data) {
        throw new NotFoundException(
          `Membership plan with ID "${id}" not found`,
        );
      }

      return transformSupabaseResultToCamelCase(data);
    } catch (error) {
      throw error;
    }
  }
}
