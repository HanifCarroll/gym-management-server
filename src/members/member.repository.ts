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
  private readonly tableName = 'member';
  private readonly selectFields =
    'id, first_name, last_name, email, phone, status, created_at, updated_at';

  constructor(private supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient().from(this.tableName);
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const snakeCaseDto = camelToSnakeCase(createMemberDto) as DbMember;
    const { data, error } = await this.supabase
      .insert([snakeCaseDto])
      .select(this.selectFields)
      .single();

    if (error) {
      this.handleError(error, 'create member');
    }

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async findAll(): Promise<Member[]> {
    const { data, error } = await this.supabase.select(this.selectFields);

    if (error) {
      this.handleError(error, 'retrieve members');
    }

    return transformSupabaseResultToCamelCase<Member[]>(data);
  }

  async findById(id: string): Promise<Member> {
    const { data, error } = await this.supabase
      .select(this.selectFields)
      .eq('id', id)
      .single();

    if (error) {
      this.handleError(error, 'retrieve member');
    }

    if (!data) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async update(updateMemberDto: UpdateMemberDto): Promise<Member> {
    const snakeCaseDto = camelToSnakeCase(updateMemberDto);
    const { data, error } = await this.supabase
      .update(snakeCaseDto)
      .eq('id', updateMemberDto.id)
      .select(this.selectFields)
      .single();

    if (error) {
      this.handleError(error, 'update member');
    }

    if (!data) {
      throw new NotFoundException(
        `Member with ID ${updateMemberDto.id} not found`,
      );
    }

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async remove(id: string): Promise<Member> {
    const { data, error } = await this.supabase
      .delete()
      .eq('id', id)
      .select(this.selectFields)
      .single();

    if (error) {
      this.handleError(error, 'delete member');
    }

    if (!data) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return transformSupabaseResultToCamelCase<Member>(data);
  }

  async updateMemberStatus(
    memberId: string,
    status: Enums<'member_status'>,
  ): Promise<void> {
    const { error } = await this.supabase.update({ status }).eq('id', memberId);

    if (error) {
      this.handleError(error, 'update member status');
    }
  }

  async findByEmail(email: string): Promise<Member | null> {
    const { data } = await this.supabase
      .select(this.selectFields)
      .eq('email', email)
      .single();

    return data ? transformSupabaseResultToCamelCase<Member>(data) : null;
  }

  private handleError(error: any, operation: string): never {
    if (error?.code === 'PGRST116') {
      throw new NotFoundException(`Member not found for ${operation}`);
    }

    throw new InternalServerErrorException(
      `Failed to ${operation}: ${error.message}`,
    );
  }
}
