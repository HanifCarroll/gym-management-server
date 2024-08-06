import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateClassInstanceDto, UpdateClassInstanceDto } from './dto';
import { addDays, format, isWithinInterval, setDay } from 'date-fns';

@Injectable()
export class ClassInstancesService {
  constructor(private supabaseService: SupabaseService) {}

  async createInstancesForClass(
    createClassInstanceDto: CreateClassInstanceDto,
  ) {
    const instances = this.generateInstances(createClassInstanceDto);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_instances')
      .insert(instances);

    if (error) throw error;
    return data;
  }

  async create(createClassInstanceDto: CreateClassInstanceDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('class_instances')
      .insert(createClassInstanceDto);

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

  async update(id: number, updateClassScheduleDto: UpdateClassInstanceDto) {
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

  private generateInstances({
    classId,
    startTime,
    endTime,
    endDate,
    startDate,
    dayOfWeek,
    instructorId,
  }: CreateClassInstanceDto) {
    const instances = [];
    let currentDate = setDay(startDate, dayOfWeek);

    while (isWithinInterval(currentDate, { start: startDate, end: endDate })) {
      instances.push({
        class_id: classId,
        date: format(currentDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        status: 'scheduled',
        instructor_id: instructorId,
        current_enrollment: 0,
      });
      currentDate = addDays(currentDate, 7); // Move to next week
    }

    return instances;
  }
}
