import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from './dto';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';

@Injectable()
export class MembershipPlansService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMembershipPlanDto: CreateMembershipPlanDto) {
    const snakeCaseDto = camelToSnakeCase(createMembershipPlanDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .insert([snakeCaseDto])
      .select()
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .select('*')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .select('*')
      .eq('plan_id', id)
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateMembershipPlanDto: UpdateMembershipPlanDto) {
    const snakeCaseDto = camelToSnakeCase(updateMembershipPlanDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .update(snakeCaseDto)
      .eq('membership_plan_id', id)
      .select()
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .delete()
      .eq('membership_plan_id', id)
      .select()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }
}
