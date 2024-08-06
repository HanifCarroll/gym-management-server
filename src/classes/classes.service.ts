import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateClassDto, UpdateClassDto } from './dto';
import { camelToSnakeCase, transformSupabaseResult } from '../utils';
import { ClassInstancesService } from '../class-instances/class-instances.service';

@Injectable()
export class ClassesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly classInstanceService: ClassInstancesService,
  ) {}

  async create(createClassDto: CreateClassDto) {
    // Insert the class
    // Format the time strings
    const snakeCaseDto = camelToSnakeCase(createClassDto);
    const { data: classData, error: classError } = await this.supabaseService
      .getClient()
      .from('classes')
      .insert(snakeCaseDto)
      .select()
      .then(transformSupabaseResult);

    if (classError) throw classError;

    const newClass = classData[0];
    const classId = newClass.id;

    // Generate and insert instances
    await this.classInstanceService.createInstancesForClass({
      classId,
      ...newClass,
    });

    return classData;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .select('*, instructors(name)')
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .select('*, instructors(name)')
      .eq('class_id', id)
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .update(updateClassDto)
      .eq('class_id', id)
      .select()
      .single()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .delete()
      .eq('class_id', id)
      .select()
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }

  async findByInstructor(instructorId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('classes')
      .select('*, instructors(name)')
      .eq('instructor_id', instructorId)
      .then(transformSupabaseResult);

    if (error) throw error;
    return data;
  }
}
