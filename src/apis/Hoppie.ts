import { NXApi } from '../index';
import { post } from '../utils';

export declare class HoppieResponse {
    response: string;
}

export class Hoppie {
    public static sendRequest(body: any): Promise<HoppieResponse> {
        return post<HoppieResponse>(new URL('/api/v1/hoppie', NXApi.url), body);
    }
}
