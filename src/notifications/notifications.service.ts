import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .insert([createNotificationDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*')
      .eq('notification_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .update(updateNotificationDto)
      .eq('notification_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .delete()
      .eq('notification_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByRecipient(recipientId: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*')
      .eq('recipient_id', recipientId);

    if (error) throw error;
    return data;
  }

  async markAsRead(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
