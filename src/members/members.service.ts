import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';

@Injectable()
export class MembersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMemberDto: CreateMemberDto) {
    const snakeCaseDto = camelToSnakeCase(createMemberDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .insert([snakeCaseDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .select('*')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .select('*')
      .eq('member_id', id)
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const snakeCaseDto = camelToSnakeCase(updateMemberDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('members')
      .update(snakeCaseDto)
      .eq('member_id', id)
      .select()
      .single()
      .then(transformSupabaseResult);

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
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }
}
