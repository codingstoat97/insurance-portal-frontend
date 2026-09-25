import { Region } from "./region-model";

export interface ClientPlan {
    planId: number;
    vehicleBrand?: string;
    vehicleModel?: string;
    vehiclePrice: number;
    vehiclePlate: string;
    vehiclePicRuat: string;
    vehiclePicFront: string;
    vehiclePicBack: string;
    vehiclePicRight: string;
    vehiclePicLeft: string;
    vehiclePicChasis: string;
    vehiclePicMileage: string;
    gender: string;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    marriedName: string;
    documentType: string;
    documentNumber: number;
    docPicFront: string;
    docPicBack: string;
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
