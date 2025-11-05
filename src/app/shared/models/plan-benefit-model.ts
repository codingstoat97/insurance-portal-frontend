export interface PlanBenefit {
    planId: number;
    benefitId: number;
    limits: Limit[];
}

export interface Limit {
    name: string;
    limit: any;
}
