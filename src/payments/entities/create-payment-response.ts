export interface CreatePaymentResponse {
  paymentId: string;
  clientSecret: string;
  paymentIntentId: string;
}
