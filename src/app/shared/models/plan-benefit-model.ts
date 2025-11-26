export interface PlanBenefit {
    id: number;
    planId: number;
    benefitId: number;
    benefitName: string;
    limits: Limit[];
}

export interface Limit {
    name: string;
    limit: any;
}