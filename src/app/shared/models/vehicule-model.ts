
export interface Vehicle {
    id: any,
    classification: string;
    brand: string;
    model: string;
    segment: string;
    vehicleType: string;
    engineType: string;
}

export interface VehicleType {
    id: any;
    name: string;
}

export interface ClientVehicle {
    brand: string;
    model: string;
    year: number;
    vehicleValue: number;
    regional: string;
    franchise: string;
    clientName: string;
    clientEmail: string;
    clientPhone: number;
}