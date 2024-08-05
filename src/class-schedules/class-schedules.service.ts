import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateClassScheduleDto, UpdateClassScheduleDto } from './dto';

@Injectable()
export class ClassSchedulesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createClassScheduleDto: CreateClassScheduleDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .insert(createClassScheduleDto);

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .select('*, classes(name, instructor_id), instructors(name)');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .select('*, classes(name, instructor_id), instructors(name)')
      .eq('schedule_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateClassScheduleDto: UpdateClassScheduleDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .update(updateClassScheduleDto)
      .eq('schedule_id', id);

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .delete()
      .eq('schedule_id', id);

    if (error) throw error;
    return data;
  }

  async findByClass(classId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .select('*, classes(name, instructor_id), instructors(name)')
      .eq('class_id', classId);

    if (error) throw error;
    return data;
  }

  async findByInstructor(instructorId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .select('*, classes(name, instructor_id), instructors(name)')
      .eq('classes.instructor_id', instructorId);

    if (error) throw error;
    return data;
  }

  async findByDayOfWeek(dayOfWeek: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_schedules')
      .select('*, classes(name, instructor_id), instructors(name)')
      .eq('day_of_week', dayOfWeek);

    if (error) throw error;
    return data;
  }
}
