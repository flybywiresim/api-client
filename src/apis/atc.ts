import { NXApi } from '../index';
import { get } from '../utils';

export enum AtcType {
    UNKNOWN,
    DELIVERY,
    GROUND,
    TOWER,
    DEPARTURE,
    APPROACH,
    RADAR,
    ATIS
}

export declare class ATCInfo {
    callsign: string;

    frequency: string;

    visualRange: number;

    textAtis: string[];

    type: AtcType;

    latitude?: number;

    longitude?: number;
}

export class ATC {
    public static async get(source: string): Promise<ATCInfo[]> {
        if (!source) {
            throw new Error('No source provided');
        }

        const url = new URL(`/api/v1/atc?source=${source}`, NXApi.url);
        return get<ATCInfo[]>(url);
    }
}
