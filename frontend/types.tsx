
export enum CarType {
  SEDAN = 'Sedan',
  COUPE = 'Coupe',
  HATCHBACK = 'Hatchback',
  SUV = 'SUV',
  TRUCK = 'Bakkie / Truck',
  LUXURY = 'Luxury / Sports'
}

export enum CarCondition {
  LIGHT = 'Light',
  MEDIUM = 'Medium',
  HEAVY = 'Heavy'
}

export enum AppointmentType {
  STUDIO = 'In-Studio Detailing',
  MOBILE = 'Mobile Detailing Unit'
}

export enum ExtraService {
  INTERIOR = 'Interior cleaning',
  WAX = 'Wax',
  ENGINE = 'Engine clean'
}

export interface CarDetails {
  type: CarType;
  year: string;
  make: string;
  model: string;
  condition: CarCondition;
  extras: ExtraService[];
}

export interface WashPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: string;
  description: string;
  image: string;
}

export interface BookingDetails {
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  appointmentType?: AppointmentType;
}

export enum AppStep {
  HOME = 'home',
  WIZARD = 'wizard',
  RESULT = 'result',
  BOOKING = 'booking',
  CONFIRMATION = 'confirmation',
  SERVICES = 'services',
  GALLERY = 'gallery',
  EQUIPMENT = 'equipment',
  CONTACT = 'contact',
  CHECKOUT = 'checkout'
}
