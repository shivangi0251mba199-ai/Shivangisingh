export type OrderStatus =
  | 'Booking Confirmed'
  | 'Pickup Scheduled'
  | 'Clothes Collected'
  | 'Washing in Progress'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type ScreenId =
  | 'home'
  | 'book'
  | 'pricing'
  | 'orders'
  | 'tracking'
  | 'profile'
  | 'admin';

export interface LaundryBooking {
  id: string;
  studentName: string;
  mobileNumber: string;
  hostelOrPgName: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTimeSlot: string;
  estimatedWeightKg: number;
  confirmedWeightKg?: number;
  pricePerKg: number;
  estimatedPrice: number;
  finalPrice?: number;
  specialInstructions: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  isDemoOrder: boolean;
}

export interface StudentProfile {
  studentName: string;
  studentId: string;
  program: string;
  mobileNumber: string;
  email: string;
  hostelOrPgName: string;
  pickupAddress: string;
  preferredTimeSlot: string;
  defaultFabricNotes: string;
}

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'Booking Confirmed',
  'Pickup Scheduled',
  'Clothes Collected',
  'Washing in Progress',
  'Ready for Delivery',
  'Delivered',
];

export const BASE_PRICE_PER_KG = 100;
export const VARIABLE_COST_PER_KG = 60;
export const CONTRIBUTION_MARGIN_PER_KG = 40;
