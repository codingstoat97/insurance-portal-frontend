
export interface Vehicle {
    id: any,
    brand: string;
    model: string;
    highEnd: boolean;
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
    vehicleType: string;
    engineType: string;
}