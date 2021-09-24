import { NXApi } from '../index';
import { get } from '../utils';

export declare class GNSSResponse {
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
}

export class GNSS {
    public static get(): Promise<GNSSResponse[]> {
        const url = new URL('/api/v1/gnss', NXApi.url);

        return get<GNSSResponse[]>(url)
            .then((res) => res.map(GNSS.mapResult));
    }

    private static mapResult(response: GNSSResponse): GNSSResponse {
        return {
            ...response,
            epoch: new Date(response.epoch),
        };
    }
}
