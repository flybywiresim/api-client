import { Telex } from './telex';

describe('TELEX with connection', () => {
    beforeAll(async () => {
        await Telex.connect({
            location: {
                long: 11,
                lat: 11,
            },
            trueAltitude: 50,
            heading: 50,
            origin: 'KLAX',
            destination: 'KJFK',
            freetextEnabled: true,
            flight: 'TEST-123',
            aircraftType: 'Unit Test',
        });
    });

    afterAll(async () => {
        await Telex.disconnect();
        await new Promise((resolve) => setTimeout(resolve, 500));
    });

    test('should update a/c data', async () => {
        await expect(Telex.update({
            trueAltitude: 90,
            heading: 90,
            location: {
                long: 11,
                lat: 11,
            },
            origin: 'KLAX',
            destination: 'KJFK',
            freetextEnabled: true,
            flight: 'TEST-123',
            aircraftType: 'Unit Test',
        }))
            .resolves.toMatchObject({
                trueAltitude: 90,
                heading: 90,
                location: {
                    x: 11,
                    y: 11,
                },
                origin: 'KLAX',
                destination: 'KJFK',
                freetextEnabled: true,
                flight: 'TEST-123',
                aircraftType: 'Unit Test',
                firstContact: expect.any(Date),
                lastContact: expect.any(Date),
                id: expect.any(String),
            });
    });

    test('should send and receive message', async () => {
        await expect(Telex.sendMessage('TEST-123', 'Hello World'))
            .resolves.toMatchObject({
                id: expect.any(String),
                createdAt: expect.any(Date),
                received: false,
                message: 'Hello World',
                isProfane: false,
                from: expect.any(Object),
                to: expect.any(Object),
            });

        await expect(Telex.fetchMessages())
            .resolves.toMatchObject([{
                id: expect.any(String),
                createdAt: expect.any(Date),
                received: false,
                message: 'Hello World',
                isProfane: false,
                from: expect.any(Object),
                to: expect.any(Object),
            }]);

        await expect(Telex.fetchMessages())
            .resolves.toMatchObject([]);
    });
});

describe('TELEX without connection', () => {
    test('should not update a/c data', async () => {
        await expect(Telex.update({
            trueAltitude: 90,
            heading: 90,
            location: {
                long: 11,
                lat: 11,
            },
            origin: 'KLAX',
            destination: 'KJFK',
            freetextEnabled: true,
            flight: 'TEST-123',
            aircraftType: 'Unit Test',
        }))
            .rejects.toThrow('TELEX is not connected');
    });

    test('should not send message', async () => {
        await expect(Telex.sendMessage('TEST-123', 'Hello World'))
            .rejects.toThrow('TELEX is not connected');
    });

    test('should not fetch message', async () => {
        await expect(Telex.fetchMessages())
            .rejects.toThrow('TELEX is not connected');
    });

    test('should not disconnect', async () => {
        await expect(Telex.disconnect())
            .rejects.toThrow('TELEX is not connected');
    });
});

describe('public TELEX API', () => {
    const getWildcardConnection = async () => {
        const conns = await Telex.fetchConnections(0, 1);
        conns.results[0].firstContact = expect.any(Date);
        conns.results[0].lastContact = expect.any(Date);
        conns.results[0].isActive = expect.any(Boolean);
        conns.results[0].heading = expect.any(Number);
        conns.results[0].trueAltitude = expect.any(Number);
        conns.results[0].location.y = expect.any(Number);
        conns.results[0].location.x = expect.any(Number);

        return conns.results[0];
    };

    test('should fetch a list of connections', async () => {
        await expect(Telex.fetchConnections()).resolves.toMatchObject({
            count: expect.any(Number),
            results: expect.any(Array),
            total: expect.any(Number),
        });
    });

    test('should fetch a list of n connections', async () => {
        await expect(Telex.fetchConnections(0, 2)).resolves.toMatchObject({
            count: 2,
            results: expect.any(Array),
            total: expect.any(Number),
        });
    });

    test('should skip n in a list of m connections', async () => {
        await expect(Telex.fetchConnections(1, 2)).resolves.toMatchObject({
            count: 2,
            results: expect.any(Array),
            total: expect.any(Number),
        });
    });

    test('should accept bounds when fetching', async () => {
        await expect(Telex.fetchConnections(1, 2, {
            north: 90,
            east: 180,
            south: -90,
            west: -180,
        })).resolves.toMatchObject({
            count: 2,
            results: expect.any(Array),
            total: expect.any(Number),
        });
    });

    test('should accept bounds when fetching all connections', async () => {
        await expect(Telex.fetchAllConnections({
            north: 1,
            east: 1,
            south: -1,
            west: -1,
        }, (flights) => {
            expect(flights).toMatchObject(expect.any(Array));
        })).resolves.toMatchObject(expect.any(Array));
    });

    test('should fetch a single connection', async () => {
        const conn = await getWildcardConnection();
        await expect(Telex.fetchConnection(conn.id)).resolves.toMatchObject(conn);
    });

    test('should find a single connection', async () => {
        const conn = await getWildcardConnection();
        await expect(Telex.findConnections(conn.flight)).resolves.toMatchObject({
            fullMatch: conn,
            matches: expect.any(Array),
        });
    });

    test('should count connections', async () => {
        await expect(Telex.countConnections()).resolves.toEqual(expect.any(Number));
    });
});
