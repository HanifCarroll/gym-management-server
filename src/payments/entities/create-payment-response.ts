import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentResponse {
  @ApiProperty({ description: 'The unique identifier of the payment' })
  paymentId: string;

  @ApiProperty({
    description: 'The client secret used to complete the payment',
  })
  clientSecret: string;

  @ApiProperty({ description: 'The unique identifier of the payment intent' })
  paymentIntentId: string;
}
