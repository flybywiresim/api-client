import { NXApi } from '../index';
import { get } from '../utils';

export declare class TafResponse {
    icao: string;

    source: string;

    taf: string;
}

export class Taf {
    public static async get(icao: string, source?: string): Promise<TafResponse> {
        if (!icao) {
            throw new Error('No ICAO provided');
        }

        const url = new URL(`/taf/${icao}`, NXApi.url);
        if (source) {
            url.searchParams.set('source', source);
        }

        return get<TafResponse>(url);
    }
}
