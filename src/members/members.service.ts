import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';

@Injectable()
export class MembersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMemberDto: CreateMemberDto) {
    const snakeCaseDto = camelToSnakeCase(createMemberDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
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
      .from('member')
      .select('id, first_name, last_name, email, phone, status')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  findOne(id: string) {
    return `This action returns a #${id} member`;
  }

  async update(updateMemberDto: UpdateMemberDto) {
    const snakeCaseDto = camelToSnakeCase(updateMemberDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .update(snakeCaseDto)
      .eq('id', updateMemberDto.id)
      .select('id, first_name, last_name, email, phone, status')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .delete()
      .eq('id', id)
      .select()
      .then(transformSupabaseResult);

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Member with ID ${id} not found`);
      }
      throw error;
    }

    if (data === null) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return data;
  }
}
