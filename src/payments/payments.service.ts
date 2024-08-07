import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StripeService } from '../stripe/stripe.service';
import { transformSupabaseResult } from '../utils';

@Injectable()
export class PaymentService {
  constructor(
    private supabaseService: SupabaseService,
    private stripeService: StripeService,
  ) {}

  async createPayment(memberId: string, amount: number) {
    const supabase = this.supabaseService.getClient();

    // Check if member exists
    const { data: member, error: memberError } = await supabase
      .from('member')
      .select()
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      throw new NotFoundException('Member not found');
    }

    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      'usd',
    );

    // Create a new payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payment')
      .insert({
        member_id: memberId,
        amount,
        status: 'Pending',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error('Failed to create payment record');
    }

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const supabase = this.supabaseService.getClient();

    // Find the payment
    const { data: payment, error: paymentError } = await supabase
      .from('payment')
      .select('*, member(*)')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (paymentError || !payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status
    const { error: updatePaymentError } = await supabase
      .from('payment')
      .update({ status: 'Successful' })
      .eq('id', payment.id);

    if (updatePaymentError) {
      throw new Error('Failed to update payment status');
    }

    // Update member status
    const { error: updateMemberError } = await supabase
      .from('member')
      .update({ status: 'Active' })
      .eq('id', payment.member_id);

    if (updateMemberError) {
      throw new Error('Failed to update member status');
    }

    // Check for existing membership
    const { data: existingMembership, error: membershipError } = await supabase
      .from('membership')
      .select()
      .eq('member_id', payment.member_id)
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (membershipError && membershipError.code !== 'PGRST116') {
      // PGRST116 is the error code for no rows returned
      throw new Error('Failed to check existing membership');
    }

    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (existingMembership) {
      // Extend existing membership
      const newEndDate = new Date(existingMembership.end_date);
      newEndDate.setDate(newEndDate.getDate() + 30);

      const { error: updateMembershipError } = await supabase
        .from('membership')
        .update({ end_date: newEndDate })
        .eq('id', existingMembership.id);

      if (updateMembershipError) {
        throw new Error('Failed to update membership');
      }
    } else {
      // Create new membership
      const { error: newMembershipError } = await supabase
        .from('membership')
        .insert({
          member_id: payment.member_id,
          plan_id: '21c21c00-0f9b-4e73-8442-91debc572959',
          start_date: now.toISOString(),
          end_date: thirtyDaysLater.toISOString(),
          status: 'Active',
        });

      if (newMembershipError) {
        throw new Error('Failed to create new membership');
      }
    }

    return payment;
  }

  async getPaymentHistory(memberId: string): Promise<any[]> {
    const supabase = this.supabaseService.getClient();

    const { data: payments, error } = await supabase
      .from('payment')
      .select('*')
      .eq('member_id', memberId)
      .order('date', { ascending: false })
      .then(transformSupabaseResult);

    if (error) {
      throw new Error('Failed to fetch payment history');
    }

    return payments;
  }

  async getAllPayments(): Promise<any[]> {
    const supabase = this.supabaseService.getClient();

    const { data: payments, error } = await supabase
      .from('payment')
      .select('*')
      .order('date', { ascending: false })
      .then(transformSupabaseResult);

    if (error) {
      throw new Error('Failed to fetch payment history');
    }

    return payments;
  }
}
