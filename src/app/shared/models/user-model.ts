import { Region } from "./region-model";

export interface ClientPlan {
    planId: number;
    vehiclePrice: number;
    vehiclePlate: string;
    gender: string;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    marriedName: string;
    documentType: string;
    countryOfBirth: string;
    birthdate: string;
    cellphone: number;
    email: string;
    maritalStatus: string;
    countryOfResidence: string;
    area: string;
    address: string;
    profession: string;
    employmentSituation: string;
    occupation: string;
    workPlace: string;
    salary: string;
}

export interface User {
    name: string;
    ci: string;
    email: string;
    password: string;
}
