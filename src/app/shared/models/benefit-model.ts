
export interface Benefit {
    id: string;
    name: string;
    description: number;
    limits: Limit[];
}

export interface Limit {
    name: string;
    measurement: number;
}
