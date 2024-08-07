import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';

@Injectable()
export class MemberService {
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

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
