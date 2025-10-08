export type VehicleType =
    | 'Sedán'
    | 'Hatchback'
    | 'SUV'
    | 'Pickup'
    | 'Motocicleta'
    | 'Van'
    | 'Camión ligero'
    | 'Bus';

export interface Vehicle {
    type: VehicleType;
    brand: string;
    model: string;
    year: number;
}

export const VEHICLE_TYPES: readonly VehicleType[] = [
    'Sedán',
    'Hatchback',
    'SUV',
    'Pickup',
    'Motocicleta',
    'Van',
    'Camión ligero',
    'Bus',
] as const;
