import { Plan } from './plan-model';

export interface ClientPlanApprovalClient {
    id: number;
    email: string;
    phone: number;
    address: string;
    gender: string;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    marriedName: string;
    documentType: string;
    ci: number;
    countryOfBirth: string;
    birthdate: string;
    cellphone: number;
    maritalStatus: string;
    countryOfResidence: string;
    area: string;
    profession: string;
    employmentSituation: string;
    occupation: string;
    workPlace: string;
    salary: string;
}

export interface ClientPlanApprovalVehicle {
    id: number;
    brand: string;
    model: string;
    classification: string;
    engineType: string;
    highEnd: boolean;
}

export interface ClientPlanApproval {
    id: number;
    plan: Plan;
    client: ClientPlanApprovalClient;
    vehicle: ClientPlanApprovalVehicle;
    vehiclePlate: string;
    vehiclePrice: number;
    soldConfirmation: boolean;
}
