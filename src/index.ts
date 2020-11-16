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

export declare class TelexMessage {
    id: string;
    createdAt: Date;
    received: boolean;
    message: string;
    isProfane: boolean;
    from: TelexConnection;
    to: TelexConnection;
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


class NXApi {
    public static url = "https://api.flybywiresim.com";
}

export class Metar {
    public static get(icao: string, source?: string): Promise<MetarResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        let url = `${NXApi.url}/metar/${icao}`;
        if (source) {
            url += `?source=${source}`;
        }

        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }
}

export class Atis {
    public static get(icao: string, source?: string): Promise<AtisResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        let url = `${NXApi.url}/atis/${icao}`;
        if (source) {
            url += `?source=${source}`;
        }

        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }
}

export class Taf {
    public static get(icao: string, source?: string): Promise<TafResponse> {
        if (!icao) {
            throw new Error("No ICAO provided");
        }

        let url = `${NXApi.url}/taf/${icao}`;
        if (source) {
            url += `?source=${source}`;
        }

        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }
}

export class Telex {
    private static accessToken: string;

    public static refreshRate = 15000;

    public static connect(status: AircraftStatus): Promise<Token> {
        const connectBody = Telex.buildBody(status);
        const headers = {
            "Content-Type": "application/json"
        };

        return fetch(`${NXApi.url}/txcxn`, {method: "POST", body: JSON.stringify(connectBody), headers})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json()
                    .then((data) => {
                        Telex.accessToken = data.accessToken;
                        return data;
                    });
            });
    }

    public static update(status: AircraftStatus): Promise<TelexConnection> {
        Telex.connectionOrThrow();

        const connectBody = Telex.buildBody(status);
        const headers = {
            "Content-Type": "application/json",
            Authorization: Telex.buildToken()
        };

        return fetch(`${NXApi.url}/txcxn`, {method: "PUT", body: JSON.stringify(connectBody), headers})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }

    public static disconnect(status: AircraftStatus): Promise<void> {
        Telex.connectionOrThrow();

        const headers = {
            Authorization: Telex.buildToken()
        };

        return fetch(`${NXApi.url}/txcxn`, {method: "DELETE", headers})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                Telex.accessToken = "";
            });
    }

    public static sendMessage(recipientFlight: string, message: string): Promise<TelexMessage> {
        Telex.connectionOrThrow();

        const body = {
            to: recipientFlight,
            message: message,
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: Telex.buildToken()
        };

        return fetch(`${NXApi.url}/txmsg`, {method: "POST", body: JSON.stringify(body), headers})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }

    public static fetchMessages(): Promise<TelexMessage[]> {
        Telex.connectionOrThrow();

        const headers = {
            Authorization: Telex.buildToken()
        };

        return fetch(`${NXApi.url}/txmsg`, {method: "GET", headers})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }

    public static fetchConnections(skip?: number, take?: number): Promise<Paginated<TelexConnection>> {
        let url = `${NXApi.url}/txcxn?`;
        if (skip) {
            url += `skip=${skip}&`;
        }
        if (take) {
            url += `take=${take}`;
        }

        return fetch(url, {method: "GET"})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }

    public static fetchConnection(id: string): Promise<TelexConnection> {
        return fetch(`${NXApi.url}/txcxn/${id}`, {method: "GET"})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
    }

    public static findConnection(flightNumber: string): Promise<TelexConnection> {
        return fetch(`${NXApi.url}/txcxn/_find?flight=${flightNumber}`, {method: "GET"})
            .then((response) => {
                if (!response.ok) {
                    throw new HttpError(response.status);
                }

                return response.json();
            });
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
}
