export type Region =
    | 'Cochabamba'
    | 'Santa Cruz'
    | 'La Paz'
    | 'Chuquisaca'
    | 'Tarija'
    | 'Oruro'
    | 'Potosí'
    | 'Beni'
    | 'Pando';

export interface Client {
    name: string;
    lastname: string;
    email: string;
    region: Region;
}

export const REGIONES_BO: readonly Region[] = [
    'Cochabamba',
    'Santa Cruz',
    'La Paz',
    'Chuquisaca',
    'Tarija',
    'Oruro',
    'Potosí',
    'Beni',
    'Pando',
] as const;
