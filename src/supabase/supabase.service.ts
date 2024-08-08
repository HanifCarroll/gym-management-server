import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Database } from './supabase';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    this.supabase = createClient<Database>(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_KEY'),
    );
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
}
