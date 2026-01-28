import { Service } from '../models';

export interface PriceCalculationInput {
  serviceType: string;
  vehicleType: string;
  extras: string[];
  condition: string;
}

export async function calculatePrice(input: PriceCalculationInput): Promise<number> {
  const service = await Service.findOne({
    where: { name: input.serviceType, active: true }
  });

  if (!service) {
    throw new Error(`Service '${input.serviceType}' not found`);
  }

  // Vehicle type multipliers
  const vehicleMultipliers: Record<string, number> = {
    'SEDAN': 1.0,
    'COUPE': 1.1,
    'HATCHBACK': 1.0,
    'SUV': 1.3,
    'TRUCK': 1.5,
    'LUXURY': 1.8
  };

  // Condition multipliers
  const conditionMultipliers: Record<string, number> = {
    'LIGHT': 1.0,
    'MODERATE': 1.2,
    'HEAVY': 1.5
  };

  // Extra service prices
  const extraPrices: Record<string, number> = {
    'INTERIOR': 150,
    'WAX': 200,
    'ENGINE': 300
  };

  let totalPrice = parseFloat(service.basePrice.toString());

  // Apply vehicle type multiplier
  const vehicleMultiplier = vehicleMultipliers[input.vehicleType.toUpperCase()] || 1.0;
  totalPrice *= vehicleMultiplier;

  // Apply condition multiplier
  const conditionMultiplier = conditionMultipliers[input.condition?.toUpperCase()] || 1.0;
  totalPrice *= conditionMultiplier;

  // Add extra services
  const extrasTotal = input.extras.reduce((sum: number, extra: string) => {
    return sum + (extraPrices[extra] || 0);
  }, 0);
  totalPrice += extrasTotal;

  return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
}