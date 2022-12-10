import { NXApi } from '../index';
import { get } from '../utils';

export enum SatelliteType {
    GPS = 'gnss',
    Iridium = 'iridium',
    IridiumNEXT = 'iridium-NEXT',
    Starlink = 'starlink',
    Galileo = 'galileo',
    GLONASS = 'glo-ops',
    Beidou = 'beidou',
    Intelsat = 'intelsat',
}

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
    public static get(type: SatelliteType): Promise<SatelliteResponse[]> {
        const url = new URL(`/api/v1/satellites?type=${type}`, NXApi.url);

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
