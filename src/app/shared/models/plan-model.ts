import { Benefit } from "./benefit-model";
import { Client } from "./user-model";
import { Vehicle } from "./vehicule-model";

// export interface Plan {
//     premium: number;
//     discount: number;
//     total: number;
//     insurance: string;
//     vehicule: Vehicle;
//     benefits: Benefit[];
// }

export interface Plan {
    premium: string;
    discount: string;
    total: string;
    insurance: string;
    vehicule: string;
    benefits: string;
}

export interface ClientPlan {
    client: Client;
    plate: string;
    plan: Plan;
    ruat: string //imagen en base 64
}
