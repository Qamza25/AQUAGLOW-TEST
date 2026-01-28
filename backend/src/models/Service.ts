import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ServiceAttributes {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in minutes
  vehicleTypes: string[]; // Which vehicle types this service applies to
  category: 'basic' | 'deluxe' | 'premium';
  features: string[];
  imageUrl?: string;
  active: boolean;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id' | 'active'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public basePrice!: number;
  public duration!: number;
  public vehicleTypes!: string[];
  public category!: 'basic' | 'deluxe' | 'premium';
  public features!: string[];
  public imageUrl?: string;
  public active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehicleTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    category: {
      type: DataTypes.ENUM('basic', 'deluxe', 'premium'),
      allowNull: false,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'services',
    timestamps: true,
  }
);

export default Service;