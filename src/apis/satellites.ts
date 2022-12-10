import { NXApi } from '../index';
import { get } from '../utils';

export declare class SatelliteResponse {
    name: string;

    id: string;

    epoch: Date;

    meanMotion: number;

    eccentricity: number;

    inclination: number;

    raOfAscNode: number;

    argOfPericenter: number;

    meanAnomaly: number;

    ephemerisType: number;

    classificationType: string;

    noradCatId: number;

    elementSetNo: number;

    revAtEpoch: number;

    bstar: number;

    meanMotionDot: number;

    meanMotionDdot: number;

    tleLineOne: string;

    tleLineTwo: string;
}

export class Satellites {
    public static get(): Promise<SatelliteResponse[]> {
        const url = new URL('/api/v1/satellites', NXApi.url);

        return get<SatelliteResponse[]>(url)
            .then((res) => res.map(Satellites.mapResult));
    }

    private static mapResult(response: SatelliteResponse): SatelliteResponse {
        return {
            ...response,
            epoch: new Date(response.epoch),
        };
    }
}
