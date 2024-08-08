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
  private readonly tableName = 'payment';
  private readonly selectFields =
    'id, member_id, amount, date, status, stripe_payment_intent_id, created_at, updated_at';

  constructor(private supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.getClient().from(this.tableName);
  }

  async createPaymentRecord(
    memberId: string,
    amount: number,
    stripePaymentIntentId: string,
  ): Promise<CreatePaymentResponse> {
    const { data, error } = await this.db
      .insert({
        member_id: memberId,
        amount,
        status: 'Pending',
        stripe_payment_intent_id: stripePaymentIntentId,
      })
      .select(this.selectFields)
      .single();

    if (error) {
      this.handleError(error, 'create payment record');
    }

    return {
      paymentId: data.id,
      clientSecret: null, // This will be set in the service
      paymentIntentId: data.stripe_payment_intent_id,
    };
  }

  async findPaymentByIntentId(paymentIntentId: string): Promise<Payment> {
    const { data, error } = await this.db
      .select(`${this.selectFields}, member(*)`)
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error) {
      this.handleError(error, 'find payment by intent ID');
    }

    if (!data) {
      throw new NotFoundException(
        `Payment with intent ID ${paymentIntentId} not found`,
      );
    }

    return transformSupabaseResultToCamelCase<Payment>(data);
  }

  async updatePaymentStatus(
    paymentId: string,
    status: Enums<'payment_status'>,
  ): Promise<void> {
    const { error } = await this.db
      .update({ status: status })
      .eq('id', paymentId);

    if (error) {
      this.handleError(error, 'update payment status');
    }
  }

  async findExistingMembership(memberId: string): Promise<any | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership')
      .select()
      .eq('member_id', memberId)
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'check existing membership');
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
      this.handleError(error, 'update membership');
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
      this.handleError(error, 'create new membership');
    }
  }

  async getPaymentHistory(memberId?: string): Promise<Payment[]> {
    let query = this.db
      .select(this.selectFields)
      .order('date', { ascending: false });

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'fetch payment history');
    }

    return transformSupabaseResultToCamelCase<Payment[]>(data);
  }

  private handleError(error: any, operation: string): never {
    if (error?.code === 'PGRST116') {
      throw new NotFoundException(`Payment not found for ${operation}`);
    }

    throw new InternalServerErrorException(
      `Failed to ${operation}: ${error.message}`,
    );
  }
}
