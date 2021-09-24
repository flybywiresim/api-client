import { NXApi } from '../index';
import { get } from '../utils';

export declare class MetarResponse {
    icao: string;

    source: string;

    metar: string;
}

export class Metar {
    public static async get(icao: string, source?: string): Promise<MetarResponse> {
        if (!icao) {
            throw new Error('No ICAO provided');
        }

        const url = new URL(`/metar/${icao}`, NXApi.url);
        if (source) {
            url.searchParams.set('source', source);
        }

        return get<MetarResponse>(url);
    }
}
