import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { Booking } from '../models';
import { BookingStatus } from '../models/Booking';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: false,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
      },
    });
  }

  async sendBookingConfirmation(booking: Booking) {
    const subject = `Booking Confirmation - ${booking.referenceNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .status-confirmed { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>AquaGlow Auto Spa</h1>
              <p>Your Car Detailing Appointment is Confirmed!</p>
            </div>
            <div class="content">
              <h2>Hello ${booking.customer?.name},</h2>
              <p>Thank you for booking with AquaGlow. Here are your appointment details:</p>
              
              <div class="details">
                <h3>Appointment Details</h3>
                <p><strong>Reference Number:</strong> ${booking.referenceNumber}</p>
                <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Service:</strong> ${booking.serviceType}</p>
                <p><strong>Vehicle:</strong> ${booking.vehicleType} ${booking.vehicleMake ? `- ${booking.vehicleMake} ${booking.vehicleModel}` : ''}</p>
                <p><strong>Total Amount:</strong> R${booking.totalPrice}</p>
                <p><strong>Status:</strong> 
                  <span class="status status-${booking.status}">${booking.status.toUpperCase()}</span>
                </p>
              </div>
              
              <h3>Location</h3>
              <p>124 Rivonia Road, Sandton, Johannesburg, 2196, South Africa</p>
              
              <h3>What to Expect</h3>
              <ul>
                <li>Please arrive 10 minutes before your scheduled time</li>
                <li>Bring your vehicle registration documents</li>
                <li>Remove personal belongings from your vehicle</li>
                <li>Estimated completion time: ${booking.appointmentType === 'studio' ? '2-3 hours' : '3-4 hours'}</li>
              </ul>
              
              <p>Need to make changes to your booking? Contact us at +27 11 456 7890 or reply to this email.</p>
              
              <p>Best regards,<br>The AquaGlow Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      AquaGlow Auto Spa - Booking Confirmation
      
      Hello ${booking.customer?.name},
      
      Your booking has been confirmed!
      
      Reference Number: ${booking.referenceNumber}
      Date: ${new Date(booking.date).toLocaleDateString()}
      Time: ${booking.time}
      Service: ${booking.serviceType}
      Vehicle: ${booking.vehicleType}
      Total: R${booking.totalPrice}
      Status: ${booking.status.toUpperCase()}
      
      Location: 124 Rivonia Road, Sandton, Johannesburg
      
      Please arrive 10 minutes early and remove personal belongings from your vehicle.
      
      Contact: +27 11 456 7890
      
      Best regards,
      The AquaGlow Team
    `;

    try {
      await this.transporter.sendMail({
        from: `"AquaGlow Auto Spa" <${config.EMAIL_FROM}>`,
        to: booking.customer?.email,
        subject,
        text,
        html,
      });
      
      console.log(`Confirmation email sent to ${booking.customer?.email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }

  async sendStatusUpdate(booking: Booking, oldStatus: BookingStatus) {
    if (booking.status === oldStatus) return;

    const subject = `Booking Status Update - ${booking.referenceNumber}`;
    
    const statusMessages: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: 'is pending confirmation',
      [BookingStatus.CONFIRMED]: 'has been confirmed',
      [BookingStatus.COMPLETED]: 'has been completed',
      [BookingStatus.CANCELLED]: 'has been cancelled',
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-update { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Status Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${booking.customer?.name},</h2>
              <p>Your booking ${statusMessages[booking.status]}.</p>
              
              <div class="status-update">
                <h3>${booking.referenceNumber}</h3>
                <p><strong>New Status:</strong> ${booking.status.toUpperCase()}</p>
                <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
              </div>
              
              <p>If you have any questions, please contact us at +27 11 456 7890.</p>
              
              <p>Best regards,<br>The AquaGlow Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"AquaGlow Auto Spa" <${config.EMAIL_FROM}>`,
        to: booking.customer?.email,
        subject,
        html,
      });
      
      console.log(`Status update email sent to ${booking.customer?.email}`);
    } catch (error) {
      console.error('Error sending status update email:', error);
    }
  }

  async sendPaymentReceipt(booking: Booking) {
    const subject = `Payment Receipt - ${booking.referenceNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Confirmed</h1>
              <p>Thank you for your payment!</p>
            </div>
            <div class="content">
              <h2>Hello ${booking.customer?.name},</h2>
              <p>Your payment for booking ${booking.referenceNumber} has been received.</p>
              
              <div class="receipt">
                <h3>Payment Receipt</h3>
                <p><strong>Reference:</strong> ${booking.referenceNumber}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Service:</strong> ${booking.serviceType}</p>
                <p><strong>Amount Paid:</strong> <span class="amount">R${booking.totalPrice}</span></p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod?.toUpperCase()}</p>
                <p><strong>Status:</strong> PAID</p>
              </div>
              
              <p>Your appointment is now confirmed. We look forward to seeing you!</p>
              
              <p>Best regards,<br>The AquaGlow Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"AquaGlow Auto Spa" <${config.EMAIL_FROM}>`,
        to: booking.customer?.email,
        subject,
        html,
      });
      
      console.log(`Payment receipt sent to ${booking.customer?.email}`);
    } catch (error) {
      console.error('Error sending payment receipt:', error);
    }
  }
}

export const emailService = new EmailService();