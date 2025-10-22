import { Client } from "./user-model";

export interface Plan {
    vehicule_catalog_id: number,
    regional_id: number,
    insurance_id: number,
    minimum_premium: string;
    rate: number;
    age_limit: number,
    discount: string;
}

export interface ClientPlan {
    client: Client;
    plate: string;
    plan: Plan;
    ruat: string //imagen en base 64
}
