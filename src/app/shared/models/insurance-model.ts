import { Region } from "./region-model";

export interface Insurance {
    id: any;
    name: string;
    type: string;
    email: string;
    qrimage: string;
    region: Region;
}
