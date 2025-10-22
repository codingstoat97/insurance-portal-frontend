import { Client } from "./user-model";

export interface Plan {
    vehiculeCatalogId: string,
    regionalId: string,
    insuranceId: string,
    minimumPremium: string;
    rate: string;
    ageLimit: string,
    discount: string;
}

export interface ClientPlan {
    client: Client;
    plate: string;
    plan: Plan;
    ruat: string //imagen en base 64
}
