
export interface Vehicle {
    id: any,
    classification: string;
    brand: string;
    model: string;
    highEnd: boolean;
    isElectric: boolean;
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
}