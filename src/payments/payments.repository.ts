import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { transformSupabaseResultToCamelCase } from '../utils';
import { Payment } from './entities/payment.entity';
import { CreatePaymentResponse } from './entities/create-payment-response';
import { Enums } from '../supabase/supabase';

@Injectable()
export class PaymentRepository {
  constructor(private supabaseService: SupabaseService) {}

  async createPaymentRecord(
    memberId: string,
    amount: number,
    stripePaymentIntentId: string,
  ): Promise<CreatePaymentResponse> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('payment')
      .insert({
        member_id: memberId,
        amount,
        status: 'Pending',
        stripe_payment_intent_id: stripePaymentIntentId,
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException('Failed to create payment record');
    }

    return {
      paymentId: data.id,
      clientSecret: null, // This will be set in the service
      paymentIntentId: data.stripe_payment_intent_id,
    };
  }

  async findPaymentByIntentId(paymentIntentId: string): Promise<Payment> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('payment')
      .select('*, member(*)')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error) {
      throw new NotFoundException('Payment not found');
    }

    return transformSupabaseResultToCamelCase<Payment>(data);
  }

  async updatePaymentStatus(
    paymentId: string,
    status: Enums<'payment_status'>,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('payment')
      .update({ status: status })
      .eq('id', paymentId);

    if (error) {
      throw new InternalServerErrorException('Failed to update payment status');
    }
  }

  async findExistingMembership(memberId: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership')
      .select()
      .eq('member_id', memberId)
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new InternalServerErrorException(
        'Failed to check existing membership',
      );
    }

    return data;
  }

  async extendMembership(
    membershipId: string,
    newEndDate: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('membership')
      .update({ end_date: newEndDate })
      .eq('id', membershipId);

    if (error) {
      throw new InternalServerErrorException('Failed to update membership');
    }
  }

  async createNewMembership(
    memberId: string,
    startDate: string,
    endDate: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('membership')
      .insert({
        member_id: memberId,
        plan_id: '21c21c00-0f9b-4e73-8442-91debc572959',
        start_date: startDate,
        end_date: endDate,
        status: 'Active',
      });

    if (error) {
      throw new InternalServerErrorException('Failed to create new membership');
    }
  }

  async getPaymentHistory(memberId?: string): Promise<Payment[]> {
    let query = this.supabaseService
      .getClient()
      .from('payment')
      .select('*')
      .order('date', { ascending: false });

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException('Failed to fetch payment history');
    }

    return transformSupabaseResultToCamelCase<Payment[]>(data);
  }
}
