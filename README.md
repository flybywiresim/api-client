# <img src="https://raw.githubusercontent.com/flybywiresim/fbw-branding/master/svg/FBW-Logo.svg" placeholder="FlyByWire" width="400"/>
# FlyByWire Simulations API Client

The official JavaScript client for the FBW API.
The library supports both JavaScript and TypeScript.

## Installation

Install the client library using npm:

    $ npm install --save @flybywiresim/api-client

## Usage

### Initializing the client
```ts
import { NXApi } from '@flybywiresim/api-client';

NXApi.url = new URL('http://localhost:3000');
```

By default, the URL is set to `https://api.flybywiresim.com`. If this is the desired URL this step can be omitted.

### METAR
```ts
import { Metar } from '@flybywiresim/api-client';

Metar.get(icao, source)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `icao` is a string of the the airport ICAO code to get the METAR for.
- `source` is the selected datasource for the METAR and is _optional_.
  Valid sources are:
  - vatsim
  - ms
  - ivao
  - pilotedge

### TAF
```ts
import { Taf } from '@flybywiresim/api-client';

Taf.get(icao, source)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `icao` is a string of the the airport ICAO code to get the TAF for.
- `source` is the selected datasource for the TAF and is _optional_.
  Valid sources are:
  - aviationweather
  - faa

### ATIS
```ts
import { Atis } from '@flybywiresim/api-client';

Atis.get(icao, source)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `icao` is a string of the the airport ICAO code to get the ATIS for.
- `source` is the selected datasource for the ATIS and is _optional_.
  Valid sources are:
  - faa
  - vatsim
  - ivao
  - pilotedge

### Airport
```ts
import { Airport } from '@flybywiresim/api-client';

Airport.get(icao)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `icao` is a string of the the airport ICAO code to search for.

### TELEX connection handling

#### Connect to TELEX system
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.connect(status)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `status` is of type `AircraftStatus` and contains information about the current flight.

The backend might block certain flight numbers from being used for various reasons.

#### Update the TELEX status
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.update(status)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `status` is of type `AircraftStatus` and contains information about the current flight.

The status has to updated every 6 minutes for the connection to stay alive.
It is recommended to update the status every 15 seconds for a usable live map.
The status can only be updated once a connection has been established.

#### Disconnect from TELEX system
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.disconnect()
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

The connection can only be disconnected once it has been established.
This releases the flight number for reuse and removes the flight from the live map.

### TELEX message handling

#### Sending a message
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.sendMessage(recipient, message)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `recipient` is a string containing the flight number of the recipient flight.
- `message` is a string containing the message to send.

Messages will be filtered for profanity in the backend.

#### Receiving messages
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.fetchMessages()
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

Messages can only be received once and will be acknowledged by this transaction.

### TELEX Querying

#### Fetch a single page of active connections
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.fetchConnections(skip, take, bounds)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `skip` is a number and tells the backend to skip the first n connections.
- `take` is a number and tells the backend how many connections to send.
- `bounds` is an optional bounding box. Query only connections within this area.

`take` and `skip` are used to control the pagination. A maximum of 100 entries can be fetched at a time.

#### Fetch all active connections
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.fetchAllConnections(bounds, callback)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `bounds` is an optional bounding box. Query only connections within this area.
- `callback` gets called after every fetched page.

#### Fetch a certain connection
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.fetchConnection(id)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `id` is the unique identifier of the connection.

#### Find a connection by a flight number
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.findConnection(flight)
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

- `flight` is the flight number to search for.

This will only return an active flight since flight numbers can be reused.

#### Count active connections
```ts
import { Telex } from '@flybywiresim/api-client';

Telex.countConnections()
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.error(err);
});
```

## License

This software is licensed under the [MIT license](https://github.com/flybywiresim/api-client/blob/main/LICENSE).
