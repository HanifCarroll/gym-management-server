import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '../utils';
import { DbMember, Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const snakeCaseDto = camelToSnakeCase(createMemberDto) as DbMember;
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .insert([snakeCaseDto])
      .select()
      .single();

    if (error) throw error;

    return transformSupabaseResultToCamelCase(data);
  }

  async findAll(): Promise<Member[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .select('id, first_name, last_name, email, phone, status');

    if (error) throw error;

    return transformSupabaseResultToCamelCase<Member[]>(data);
  }

  async update(updateMemberDto: UpdateMemberDto): Promise<Member> {
    const snakeCaseDto = camelToSnakeCase(updateMemberDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .update(snakeCaseDto)
      .eq('id', updateMemberDto.id)
      .select('id, first_name, last_name, email, phone, status');

    if (error) throw error;

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async remove(id: string): Promise<Member> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Member with ID ${id} not found`);
      }
      throw error;
    }

    if (data === null) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return transformSupabaseResultToCamelCase<Member>(data);
  }
}
