import { NXApi } from '../index';
import { del, get, post, put } from '../utils';

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

export class TelexNotConnectedError extends Error {
    constructor() {
        super('TELEX is not connected');
    }
}

export class Telex {
    private static accessToken: string;

    public static connect(status: AircraftStatus): Promise<Token> {
        return post<Token>(new URL('/txcxn', NXApi.url), Telex.buildBody(status))
            .then((res) => {
                Telex.accessToken = res.accessToken;
                return res;
            });
    }

    public static async update(status: AircraftStatus): Promise<TelexConnection> {
        Telex.connectionOrThrow();

        return put<TelexConnection>(new URL('/txcxn', NXApi.url), Telex.buildBody(status), { Authorization: Telex.buildToken() })
            .then(Telex.mapConnection);
    }

    public static async disconnect(): Promise<void> {
        Telex.connectionOrThrow();

        return del(new URL('/txcxn', NXApi.url), { Authorization: Telex.buildToken() })
            .then(() => {
                Telex.accessToken = '';
            });
    }

    public static async sendMessage(recipientFlight: string, message: string): Promise<TelexMessage> {
        Telex.connectionOrThrow();

        return post<TelexMessage>(new URL('/txmsg', NXApi.url), {
            to: recipientFlight,
            message,
        }, { Authorization: Telex.buildToken() })
            .then(Telex.mapMessage);
    }

    public static async fetchMessages(): Promise<TelexMessage[]> {
        Telex.connectionOrThrow();

        return get<TelexMessage[]>(new URL('/txmsg', NXApi.url), { Authorization: Telex.buildToken() })
            .then((res) => res.map(Telex.mapMessage));
    }

    public static fetchConnections(skip?: number, take?: number, bounds?: Bounds): Promise<Paginated<TelexConnection>> {
        const url = new URL('/txcxn', NXApi.url);
        if (skip) {
            url.searchParams.set('skip', skip.toString());
        }
        if (take) {
            url.searchParams.append('take', take.toString());
        }
        if (bounds) {
            url.searchParams.append('north', bounds.north.toString());
            url.searchParams.append('east', bounds.east.toString());
            url.searchParams.append('south', bounds.south.toString());
            url.searchParams.append('west', bounds.west.toString());
        }

        return get<Paginated<TelexConnection>>(url)
            .then((res) => ({
                ...res,
                results: res.results.map(Telex.mapConnection),
            }));
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
        return get<TelexConnection>(new URL(`/txcxn/${id}`, NXApi.url))
            .then(Telex.mapConnection);
    }

    public static findConnections(flightNumber: string): Promise<SearchResult<TelexConnection>> {
        const url = new URL('/txcxn/_find', NXApi.url);
        url.searchParams.set('flight', flightNumber);

        return get<SearchResult<TelexConnection>>(url)
            .then((res) => ({
                matches: res.matches.map(Telex.mapConnection),
                fullMatch: res.fullMatch ? Telex.mapConnection(res.fullMatch) : undefined,
            }));
    }

    public static countConnections(): Promise<number> {
        return get<number>(new URL('/txcxn/_count', NXApi.url));
    }

    private static buildBody(status: AircraftStatus) {
        return {
            location: {
                x: status.location.long,
                y: status.location.lat,
            },
            trueAltitude: status.trueAltitude,
            heading: status.heading,
            origin: status.origin,
            destination: status.destination,
            freetextEnabled: status.freetextEnabled,
            flight: status.flight,
            aircraftType: status.aircraftType,
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
            lastContact: new Date(connection.lastContact),
        };
    }

    private static mapMessage(message: TelexMessage): TelexMessage {
        const msg: TelexMessage = {
            ...message,
            createdAt: new Date(message.createdAt),
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
