import { Benefit } from "./benefit-model";

export interface Plan {
    id: number;
    vehicleId: number;
    regionalId: number;
    insuranceId: number;
    minimumPremium: number;
    rate: number;
    ageLimit: number;
    discount: number;
    level: string;
    franchise: number;
    state: boolean;
    benefits: Benefit[];
}

