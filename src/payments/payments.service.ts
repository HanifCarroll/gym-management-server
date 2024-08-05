import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  private readonly supabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabaseClient = this.supabaseService.getClient();
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const { data, error } = await this.supabaseClient
      .from('payments')
      .insert(createPaymentDto);

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseClient
      .from('payments')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseClient
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const { data, error } = await this.supabaseClient
      .from('payments')
      .update(updatePaymentDto)
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseClient
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
}
