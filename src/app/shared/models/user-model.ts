import { Region } from "./region-model";


export interface Client {
    //USER: gender, birthdate, cellphone, ci , nit, category-rubro, profession, marital-status, birth country
    //currently reside on, etc
}

export interface User {
    name: string;
    lastname: string;
    email: string;
    region: Region;
}
