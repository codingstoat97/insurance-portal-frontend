import { Region } from "./region-model";

export interface Insurance {
    name: string;
    type: string;
    email: string;
    qrimage: string;
    region: Region;
}
