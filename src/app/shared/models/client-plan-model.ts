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
    ciPicFront?: string;
    ciPicBack?: string;
    countryOfBirth: string;
    birthdate: string;
    maritalStatus: string;
    countryOfResidence: string;
    area: string;
    profession: string;
    employmentSituation: string;
    occupation: string;
    workPlace: string;
    salary: string;
}

export interface ClientPlanApproval {
    id: number;
    plan: Plan;
    client: ClientPlanApprovalClient;
    vehicleBrand: string;
    vehicleModel: string;
    vehiclePlate: string;
    vehiclePrice: number;
    vehiclePicRuat?: string;
    vehiclePicFront?: string;
    vehiclePicBack?: string;
    vehiclePicRight?: string;
    vehiclePicLeft?: string;
    vehiclePicChasis?: string;
    vehiclePicMileage?: string;
    soldConfirmation: boolean;
}
