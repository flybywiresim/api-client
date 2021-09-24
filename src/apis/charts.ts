import { NXApi } from '../index';
import { get } from '../utils';

export declare class Chart {
    url: string;

    name: string;
}

export declare class ChartsResponse {
    icao: string;

    charts?: Chart[];
}

export class Charts {
    public static async get(icao: string): Promise<ChartsResponse> {
        if (!icao) {
            throw new Error('No ICAO provided');
        }

        const url = new URL(`/api/v1/charts/${icao}`, NXApi.url);

        return get<ChartsResponse>(url);
    }
}
