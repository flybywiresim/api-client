import { Taf } from './taf';

describe('TAF', () => {
    test('should return a TAF response', async () => {
        const res = await Taf.get('KJFK');
        console.log(res);

        expect(res.icao).toEqual('KJFK');
        expect(res.source).toEqual('AviationWeather');
    });

    test('should allow selection of sources', async () => {
        const res = await Taf.get('KJFK', 'FAA');
        console.log(res);

        expect(res.icao).toEqual('KJFK');
        expect(res.source).toEqual('FAA');
    });

    describe('error handling', () => {
        test('should require an ICAO', async () => {
            await expect(Taf.get('')).rejects.toThrow('No ICAO provided');
        });

        test('should 404 on unknown ICAOs', async () => {
            await expect(Taf.get('NONEXISTING')).rejects.toThrow('Request failed with status code 404');
        });
    });
});
