import { Plan } from './plan-model';

export interface ClientPlanApproval {
    id: number;
    plan: Plan;
    clientName: string;
    clientEmail: string;
    clientCellphone: number;
    vehiclePlate: string;
    vehiclePrice: number;
    soldConfirmation: boolean;
}
