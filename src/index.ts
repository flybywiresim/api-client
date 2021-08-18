// Types
export declare class MetarResponse {
    icao: string;
    source: string;
    metar: string;
}

export declare class TafResponse {
    icao: string;
    source: string;
    taf: string;
}

export declare class AtisResponse {
    icao: string;
    source: string;
    combined?: string;
    arr?: string;
    dep?: string;
}

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
    callsign:string;
    frequency:string;
    visualRange:number;
    textAtis: string[];
    type:AtcType;
    latitude?: number;
    longitude?: number;
  }

  export declare class PilotInfo {
    callsign: string;  
    name: string;
    latitude?: number;
    longitude?: number;
    altitude:number;
    heading:number;
    groundspeed:number;
    departure: string;
    arrival: string;
    aircraft: string;
  }

export declare class TelexConnection {
    id: string;
    isActive: boolean;
    firstContact: Date;
    lastContact: Date;
    flight: string;
    location: {
        x: number;
        y: number;
    };
    trueAltitude: number;
    heading: number;
    freetextEnabled: boolean;
    aircraftType: string;
    origin: string;
    destination: string;
}

export declare class SearchResult<T> {
    fullMatch?: T;
    matches: T[];
}

export declare class TelexMessage {
    id: string;
    createdAt: Date;
    received: boolean;
    message: string;
    isProfane: boolean;
    from: TelexConnection;
    to?: TelexConnection;
}

export declare class Token {
    accessToken: string;
    connection: string;
    flight: string;
}

export declare class AircraftStatus {
    location: {
        long: number;
        lat: number;
    };
    trueAltitude: number;
    heading: number;
    origin: string;
    destination: string;
    freetextEnabled: boolean;
    flight: string;
    aircraftType: string;
}

export declare class CommitInfo {
    sha: string;
    shortSha: string;
    timestamp: Date;
}

export declare class ReleaseInfo {
    name: string;
    publishedAt: Date;
    htmlUrl: string;
    body: string;
}

export declare class PullLabel {
    id: string;
    name: string;
    color: string;
}

export declare class PullInfo {
    number: number;
    title: string;
    author: string;
    labels: PullLabel[];
    isDraft: boolean;
}

export declare class ArtifactInfo {
    artifactUrl: string;
}

export declare class Chart {
    url: string;
    name: string;
}

export declare class ChartsResponse {
    icao: string;
    charts?: Chart[];
}

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

export declare class Paginated<T> {
    results: T[];
    count: number;
    total: number;
}

export declare class Bounds {
    north: number;
    east: number;
    south: number;
    west: number;
}

export declare type StageCallback = (flights: TelexConnection[]) => void;

export class HttpError extends Error {
    public readonly status;

    constructor(status: number, message?: string) {
        super(message);
        this.status = status;
    }
}

export class TelexNotConnectedError extends Error {
    constructor() {
        super("TELEX is not connected");
    }
}


function _get<T>(url: URL, headers?: any): Promise<T> {
    return fetch(url.href, { headers })
        .then((response) => {
            if (!response.ok) {
                throw new HttpError(response.status);
            }

            return response.json();
        });
}

function _delete(url: URL, headers?: any): Promise<void> {
    return fetch(url.href, { method: "DELETE", headers })
        .then((response) => {
            if (!response.ok) {
                throw new HttpError(response.status);
            }

            return;
        });
}

function _post<T>(url: URL, body: any, headers?: any): Promise<T> {
    const headersToSend = {
        "Content-Type": "application/json",
        ...headers
    };

    return fetch(url.href, { method: "POST", body: JSON.stringify(body), headers: headersToSend })
        .then((response) => {
            if (!response.ok) {
                throw new HttpError(response.status);
            }

            return response.json();
        });
}

function _put<T>(url: URL, body: any, headers?: any): Promise<T> {
    const headersToSend = {
        "Content-Type": "application/json",
        ...headers
    };

    return fetch(url.href, { method: "PUT", body: JSON.stringify(body), headers: headersToSend })
        .then((response) => {
            if (!response.ok) {
                throw new HttpError(response.status);
            }

            return response.json();
        });
}


export class NXApi {
    public static url = new URL("https://api.flybywiresim.com");
    // public static url = new URL("http://localhost:3000");
}

export class Metar {
    public static get(icao: string, source?: string): Promise<MetarResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        const url = new URL(`/metar/${icao}`, NXApi.url);
        if (source) {
            url.searchParams.set("source", source);
        }

        return _get<MetarResponse>(url);
    }
}

export class Atis {
    public static get(icao: string, source?: string): Promise<AtisResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        const url = new URL(`/atis/${icao}`, NXApi.url);
        if (source) {
            url.searchParams.set("source", source);
        }

        return _get<AtisResponse>(url);
    }
}

export class Taf {
    public static get(icao: string, source?: string): Promise<TafResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        const url = new URL(`/taf/${icao}`, NXApi.url);
        if (source) {
            url.searchParams.set("source", source);
        }

        return _get<TafResponse>(url);
    }
}

export class Telex {
    private static accessToken: string;

    public static refreshRate = 15000;

    public static connect(status: AircraftStatus): Promise<Token> {
        return _post<Token>(new URL(`/txcxn`, NXApi.url), Telex.buildBody(status))
            .then(res => {
                Telex.accessToken = res.accessToken;
                return res;
            });
    }

    public static update(status: AircraftStatus): Promise<TelexConnection> {
        Telex.connectionOrThrow();

        return _put<TelexConnection>(new URL(`/txcxn`, NXApi.url), Telex.buildBody(status), {
            Authorization: Telex.buildToken()
        })
            .then(Telex.mapConnection);
    }

    public static disconnect(): Promise<void> {
        Telex.connectionOrThrow();

        return _delete(new URL(`/txcxn`, NXApi.url), {
            Authorization: Telex.buildToken()
        })
            .then(() => {
                Telex.accessToken = "";
                return;
            });
    }

    public static sendMessage(recipientFlight: string, message: string): Promise<TelexMessage> {
        Telex.connectionOrThrow();

        return _post<TelexMessage>(new URL(`/txmsg`, NXApi.url), {
            to: recipientFlight,
            message: message
        }, {
            Authorization: Telex.buildToken()
        })
            .then(Telex.mapMessage);
    }

    public static fetchMessages(): Promise<TelexMessage[]> {
        Telex.connectionOrThrow();

        return _get<TelexMessage[]>(new URL(`/txmsg`, NXApi.url), {
            Authorization: Telex.buildToken()
        })
            .then(res => res.map(Telex.mapMessage));
    }

    public static fetchConnections(skip?: number, take?: number, bounds?: Bounds): Promise<Paginated<TelexConnection>> {
        const url = new URL(`/txcxn`, NXApi.url);
        if (skip) {
            url.searchParams.set("skip", skip.toString());
        }
        if (take) {
            url.searchParams.append("take", take.toString());
        }
        if (bounds) {
            url.searchParams.append("north", bounds.north.toString());
            url.searchParams.append("east", bounds.east.toString());
            url.searchParams.append("south", bounds.south.toString());
            url.searchParams.append("west", bounds.west.toString());
        }

        return _get<Paginated<TelexConnection>>(url)
            .then(res => {
                return {
                    ...res,
                    results: res.results.map(Telex.mapConnection)
                };
            });
    }

    public static async fetchAllConnections(bounds?: Bounds, stageCallback?: StageCallback): Promise<TelexConnection[]> {
        let flights: TelexConnection[] = [];
        let skip = 0;
        let total = 0;

        do {
            const data = await Telex.fetchConnections(skip, 100, bounds);

            total = data.total;
            skip += data.count;
            flights = flights.concat(data.results);

            if (stageCallback) {
                stageCallback(flights);
            }
        }
        while (total > skip);

        return flights;
    }

    public static fetchConnection(id: string): Promise<TelexConnection> {
        return _get<TelexConnection>(new URL(`/txcxn/${id}`, NXApi.url))
            .then(Telex.mapConnection);
    }

    public static findConnections(flightNumber: string): Promise<SearchResult<TelexConnection>> {
        const url = new URL(`/txcxn/_find`, NXApi.url);
        url.searchParams.set("flight", flightNumber);

        return _get<SearchResult<TelexConnection>>(url)
            .then(res => {
                return {
                    matches: res.matches.map(Telex.mapConnection),
                    fullMatch: res.fullMatch ? Telex.mapConnection(res.fullMatch) : undefined,
                }
            });
    }

    public static countConnections(): Promise<number> {
        return _get<number>(new URL(`/txcxn/_count`, NXApi.url));
    }


    private static buildBody(status: AircraftStatus) {
        return {
            location: {
                x: status.location.long,
                y: status.location.lat
            },
            trueAltitude: status.trueAltitude,
            heading: status.heading,
            origin: status.origin,
            destination: status.destination,
            freetextEnabled: status.freetextEnabled,
            flight: status.flight,
            aircraftType: status.aircraftType
        };
    }

    private static buildToken(): string {
        return `Bearer ${Telex.accessToken}`;
    }

    private static connectionOrThrow() {
        if (!Telex.accessToken) {
            throw new TelexNotConnectedError();
        }
    }

    private static mapConnection(connection: TelexConnection): TelexConnection {
        return {
            ...connection,
            firstContact: new Date(connection.firstContact),
            lastContact: new Date(connection.lastContact)
        };
    }

    private static mapMessage(message: TelexMessage): TelexMessage {
        const msg: TelexMessage = {
            ...message,
            createdAt: new Date(message.createdAt)
        };

        if (message.from) {
            msg.from = Telex.mapConnection(message.from);
        }

        if (message.to) {
            msg.to = Telex.mapConnection(message.to);
        }

        return msg;
    }
}

export class Airport {
    public static get(icao: string): Promise<AirportResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        return _get<AirportResponse>(new URL(`/api/v1/airport/${icao}`, NXApi.url));
    }

    public static getBatch(icaos: string[]): Promise<AirportResponse[]> {
        if (!icaos) {
            throw new Error("No ICAOs provided");
        }

        return _post<AirportResponse[]>(new URL(`/api/v1/airport/_batch`, NXApi.url), { icaos });
    }
}

export class ATC {
    public static getAtc(source: string): Promise<ATCInfo[]> {
        const url = new URL(`/api/v1/atc?source=${source}`, NXApi.url);
        return _get<ATCInfo[]>(url);
    }
}

export class Pilot {
    public static getPilots(source: string) : Promise<PilotInfo[]>{
        const url = new URL(`/api/v1/pilot?source=${source}`, NXApi.url);
        return _get<PilotInfo[]>(url);
    }
}

export class GitVersions {
    public static getNewestCommit(user: string, repo: string, branch: string): Promise<CommitInfo> {
        if (!user || !repo || !branch) {
            throw new Error("Missing argument");
        }

        return _get<CommitInfo>(new URL(`/api/v1/git-versions/${user}/${repo}/branches/${branch}`, NXApi.url))
            .then((res: CommitInfo) => {
                return {
                    ...res,
                    timestamp: new Date(res.timestamp)
                };
            });
    }

    public static getReleases(user: string, repo: string, includePreReleases?: boolean): Promise<ReleaseInfo[]> {
        if (!user || !repo) {
            throw new Error("Missing argument");
        }

        return _get<ReleaseInfo[]>(
            new URL(`/api/v1/git-versions/${user}/${repo}/releases?${includePreReleases === true}`, NXApi.url)
        )
            .then(res => res.map(rel => {
                return {
                    ...rel,
                    publishedAt: new Date(rel.publishedAt)
                };
            }));
    }

    public static getPulls(user: string, repo: string): Promise<PullInfo[]> {
        if (!user || !repo) {
            throw new Error("Missing argument");
        }

        return _get<PullInfo[]>(new URL(`/api/v1/git-versions/${user}/${repo}/pulls`, NXApi.url));
    }

    public static getArtifact(user: string, repo: string, pull: string): Promise<ArtifactInfo> {
        if (!user || !repo || !pull) {
            throw new Error("Missing argument");
        }

        return _get<ArtifactInfo>(new URL(`/api/v1/git-versions/${user}/${repo}/pulls/${pull}/artifact`, NXApi.url));
    }
}

export class Charts {
    public static get(icao: string, source?: string): Promise<ChartsResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        const url = new URL(`/api/v1/charts/${icao}`, NXApi.url);

        return _get<ChartsResponse>(url);
    }
}

export class GNSS {
    public static get(): Promise<GNSSResponse[]> {
        const url = new URL(`/api/v1/gnss`, NXApi.url);

        return _get<GNSSResponse[]>(url)
            .then(res => res.map(GNSS.mapResult));
    }

    private static mapResult(response: GNSSResponse): GNSSResponse {
        return {
            ...response,
            epoch: new Date(response.epoch)
        };
    }
}
