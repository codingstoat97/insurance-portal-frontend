import { Benefit } from "./benefit-model";
import { Client } from "./user-model";

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

export interface ClientPlan {
    client: Client;
    plate: string;
    plan: Plan;
    ruat: string //imagen en base 64
}
