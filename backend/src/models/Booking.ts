import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';

export enum AppointmentType {
  STUDIO = 'studio',
  MOBILE = 'mobile'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

interface BookingAttributes {
  id: string;
  customerId: string;
  date: Date;
  time: string;
  serviceType: string;
  vehicleType: string;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  condition?: string;
  extras: string[];
  appointmentType: AppointmentType;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod?: 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
  referenceNumber: string;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'referenceNumber'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public customerId!: string;
  public date!: Date;
  public time!: string;
  public serviceType!: string;
  public vehicleType!: string;
  public vehicleYear?: string;
  public vehicleMake?: string;
  public vehicleModel?: string;
  public condition?: string;
  public extras!: string[];
  public appointmentType!: AppointmentType;
  public totalPrice!: number;
  public status!: BookingStatus;
  public paymentMethod?: 'card' | 'cash';
  public paymentStatus!: 'pending' | 'paid' | 'failed';
  public notes?: string;
  public referenceNumber!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly customer?: Customer;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleYear: {
      type: DataTypes.STRING,
    },
    vehicleMake: {
      type: DataTypes.STRING,
    },
    vehicleModel: {
      type: DataTypes.STRING,
    },
    condition: {
      type: DataTypes.STRING,
    },
    extras: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    appointmentType: {
      type: DataTypes.ENUM(...Object.values(AppointmentType)),
      defaultValue: AppointmentType.STUDIO,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BookingStatus)),
      defaultValue: BookingStatus.PENDING,
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'cash'),
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    referenceNumber: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: function() {
        return 'AG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      },
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Booking;