import { Enums } from '../../supabase/supabase';

export interface DbMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: Enums<'member_status'>;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: Enums<'member_status'>;
  createdAt: string;
  updatedAt: string;
}
