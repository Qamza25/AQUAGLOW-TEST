import Booking from './Booking';
import Customer from './Customer';
import Service from './Service';

// Define associations
Booking.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Booking, { foreignKey: 'customerId', as: 'bookings' });

export { Booking, Customer, Service };

export default {
  Booking,
  Customer,
  Service,
};