import { NXApi } from '../index';
import { get, post } from '../utils';

export declare class AirportResponse {
    icao: string;

    iata: string;

    type: string;

    name: string;

    lat: number;

    lon: number;

    elevation: number;

    continent: string;

    country: string;

    transAlt: number;
}

export class Airport {
    public static get(icao: string): Promise<AirportResponse> {
        if (!icao) {
            throw new Error('No ICAO provided');
        }

        return get<AirportResponse>(new URL(`/api/v1/airport/${icao}`, NXApi.url));
    }

    public static getBatch(icaos: string[]): Promise<AirportResponse[]> {
        if (!icaos) {
            throw new Error('No ICAOs provided');
        }

        return post<AirportResponse[]>(new URL('/api/v1/airport/_batch', NXApi.url), { icaos });
    }
}
