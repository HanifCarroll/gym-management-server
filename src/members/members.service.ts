import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMemberDto: CreateMemberDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .insert([createMemberDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .select('*')
      .eq('member_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .update(updateMemberDto)
      .eq('member_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .delete()
      .eq('member_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
