export interface Client {
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
