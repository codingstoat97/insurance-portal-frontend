
export interface Vehicle {
    id: any,
    classification: string;
    brand: string;
    model: string;
    highEnd: boolean;
    vehicleType: string;
}

export interface VehicleType {
    id: any;
    name: string;
}

export interface ClientVehicle {
    brand: string;
    model: string;
    classification: string;
    year: number;
    vehicleValue: number;
    regional: string;
    level: string;
    franchise: string;
    vehicleType: string;
}