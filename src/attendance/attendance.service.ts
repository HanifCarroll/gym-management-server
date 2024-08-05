import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto';

@Injectable()
export class AttendanceService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .select('*, members(name), classes(name)');
    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .select('*, members(name), classes(name)')
      .eq('attendance_id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .insert(createAttendanceDto);
    if (error) throw error;
    return data;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .update(updateAttendanceDto)
      .eq('attendance_id', id);
    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .delete()
      .eq('attendance_id', id);
    if (error) throw error;
    return data;
  }

  async getAttendanceByMember(memberId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .select('*, classes(name)')
      .eq('member_id', memberId);
    if (error) throw error;
    return data;
  }

  async getAttendanceByClass(classId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .select('*, members(name)')
      .eq('class_id', classId);
    if (error) throw error;
    return data;
  }

  async getAttendanceReport(startDate: string, endDate: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('attendance')
      .select('*, members(name), classes(name)')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    if (error) throw error;
    return data;
  }
}
