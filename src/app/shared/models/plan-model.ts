import { Benefit } from "./benefit-model";

export interface Plan {
    id: number;
    name: string;
    regionalId: number;
    insuranceId: number;
    minimumPremium: number;
    rate: number;
    ageLimit: number;
    discount: number;
    interest: number;
    segmentId: number;
    planTypeId: number;
    vehicleTypeId: number;
    engineType: string;
    segment?: string;
    planType?: string;
    vehicleType?: string;
    franchise: string;
    state: boolean;
    createdBy: string;
    brokerId?: number;
    benefits: Benefit[];
}

