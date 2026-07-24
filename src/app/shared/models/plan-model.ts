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
    segmentId: number;
    planTypeId: number;
    segment?: string;
    planType?: string;
    franchise: number;
    state: boolean;
    createdBy: string;
    brokerId?: number;
    benefits: Benefit[];
}

