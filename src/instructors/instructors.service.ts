import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateInstructorDto, UpdateInstructorDto } from './dto';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';

@Injectable()
export class InstructorsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createInstructorDto: CreateInstructorDto) {
    const snakeCaseDto = camelToSnakeCase(createInstructorDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
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
      .from('instructors')
      .select('*')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .select('*')
      .eq('instructor_id', id)
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto) {
    const snakeCaseDto = camelToSnakeCase(updateInstructorDto);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .update(snakeCaseDto)
      .eq('instructor_id', id)
      .select()
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .delete()
      .eq('instructor_id', id)
      .select()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }
}
