import { Client } from "./user-model";

export interface Plan {
    vehiculeCatalogId: number,
    regionalId: number,
    insuranceId: number,
    minimumPremium: number;
    rate: number;
    ageLimit: number,
    discount: number;
}

export interface ClientPlan {
    client: Client;
    plate: string;
    plan: Plan;
    ruat: string //imagen en base 64
}
