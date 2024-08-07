import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';

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
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .select('*')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .select('*')
      .eq('id', id)
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async update(id: string, updateMembershipPlanDto: UpdateMembershipPlanDto) {
    const snakeCaseDto = camelToSnakeCase(updateMembershipPlanDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .update(snakeCaseDto)
      .eq('id', id)
      .select()
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plan')
      .delete()
      .eq('id', id)
      .select()
      .single()
      .then(transformSupabaseResult);

    if (error) {
      if (error.code === 'PGRST116') {
        // This error code indicates that no rows were affected
        throw new NotFoundException(
          `Membership plan with ID "${id}" not found`,
        );
      }
      throw error;
    }

    if (!data) {
      throw new NotFoundException(`Membership plan with ID "${id}" not found`);
    }

    return data;
  }
}
