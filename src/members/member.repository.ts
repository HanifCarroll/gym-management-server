import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { DbMember, Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '../utils';
import { Enums } from '../supabase/supabase';

@Injectable()
export class MemberRepository {
  constructor(private supabaseService: SupabaseService) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const snakeCaseDto = camelToSnakeCase(createMemberDto) as DbMember;
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .insert([snakeCaseDto])
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException('Failed to create member');

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async findAll(): Promise<Member[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .select('id, first_name, last_name, email, phone, status');

    if (error)
      throw new InternalServerErrorException('Failed to retrieve members');

    return transformSupabaseResultToCamelCase<Member[]>(data);
  }

  async findById(id: string): Promise<Member> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .select('id, first_name, last_name, email, phone, status')
      .eq('id', id)
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to retrieve member');
    }

    if (!data) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async update(updateMemberDto: UpdateMemberDto): Promise<Member> {
    const snakeCaseDto = camelToSnakeCase(updateMemberDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('member')
      .update(snakeCaseDto)
      .eq('id', updateMemberDto.id)
      .select('id, first_name, last_name, email, phone, status');

    if (error)
      throw new InternalServerErrorException('Failed to update member');

    if (!data || data.length === 0) {
      throw new NotFoundException(
        `Member with ID ${updateMemberDto.id} not found`,
      );
    }

    return transformSupabaseResultToCamelCase<Member>(data[0]);
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
      throw new InternalServerErrorException('Failed to delete member');
    }

    if (!data || data.length === 0) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return transformSupabaseResultToCamelCase<Member>(data[0]);
  }

  async updateMemberStatus(
    memberId: string,
    status: Enums<'member_status'>,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('member')
      .update({ status })
      .eq('id', memberId);

    if (error) {
      throw new InternalServerErrorException('Failed to update member status');
    }
  }
}
