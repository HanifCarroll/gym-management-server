import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateInstructorDto, UpdateInstructorDto } from './dto';

@Injectable()
export class InstructorsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createInstructorDto: CreateInstructorDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .insert([createInstructorDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .select('*')
      .eq('instructor_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('instructors')
      .update(updateInstructorDto)
      .eq('instructor_id', id)
      .select()
      .single();

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
      .single();

    if (error) throw error;
    return data;
  }
}
