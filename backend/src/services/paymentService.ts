import Stripe from 'stripe';
import { config } from '../config/env';
import { Booking } from '../models';

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(booking: Booking) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(booking.totalPrice * 100), // Convert to cents
        currency: 'zar',
        metadata: {
          bookingId: booking.id,
          referenceNumber: booking.referenceNumber,
          customerEmail: booking.customer?.email || '',
        },
        description: `AquaGlow Booking: ${booking.referenceNumber}`,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.totalPrice,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async handleWebhook(payload: any, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        config.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata?.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    try {
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        await booking.update({
          paymentStatus: 'paid',
          status: 'confirmed',
        });
        
        // Send confirmation email
        // emailService.sendPaymentReceipt(booking);
      }
    } catch (error) {
      console.error('Error updating booking after payment:', error);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata?.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    try {
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        await booking.update({
          paymentStatus: 'failed',
        });
      }
    } catch (error) {
      console.error('Error updating booking after payment failure:', error);
    }
  }
}

export const paymentService = new PaymentService();