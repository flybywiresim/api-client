import { NXApi } from '../index';
import { get } from '../utils';

export declare class AtisResponse {
    icao: string;

    source: string;

    combined?: string;

    arr?: string;

    dep?: string;
}

export class Atis {
    public static async get(icao: string, source?: string): Promise<AtisResponse> {
        if (!icao) {
            throw new Error('No ICAO provided');
        }

        const url = new URL(`/atis/${icao}`, NXApi.url);
        if (source) {
            url.searchParams.set('source', source);
        }

        return get<AtisResponse>(url);
    }
}
