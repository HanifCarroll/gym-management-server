import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMembershipPlanDto, UpdateMembershipPlanDto } from './dto';

@Injectable()
export class MembershipPlansService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMembershipPlanDto: CreateMembershipPlanDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .insert([createMembershipPlanDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .select('*')
      .eq('plan_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateMembershipPlanDto: UpdateMembershipPlanDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .update(updateMembershipPlanDto)
      .eq('plan_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership_plans')
      .delete()
      .eq('plan_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
