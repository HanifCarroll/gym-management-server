import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateClassDto, UpdateClassDto } from './dto';

@Injectable()
export class ClassesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createClassDto: CreateClassDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .insert(createClassDto);

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .select('*, instructors(name)');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .select('*, instructors(name)')
      .eq('class_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .update(updateClassDto)
      .eq('class_id', id);

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .delete()
      .eq('class_id', id);

    if (error) throw error;
    return data;
  }

  async findByInstructor(instructorId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .select('*, instructors(name)')
      .eq('instructor_id', instructorId);

    if (error) throw error;
    return data;
  }
}
