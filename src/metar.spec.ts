import { Metar } from './index';

describe('METAR', () => {
    test('should return a METAR response', async () => {
        const res = await Metar.get('KJFK');
        console.log(res);

        expect(res.icao).toEqual('KJFK');
        expect(res.source).toEqual('Vatsim');
        expect(res.metar).not.toEqual('');
    });

    test('should allow selection of sources', async () => {
        const res = await Metar.get('KJFK', 'MS');
        console.log(res);

        expect(res.icao).toEqual('KJFK');
        expect(res.source).toEqual('MS');
        expect(res.metar).not.toEqual('');
    });

    describe('error handling', () => {
        test('should require an ICAO', async () => {
            await expect(Metar.get('')).rejects.toThrow('No ICAO provided');
        });

        test('should 404 on unknown ICAOs', async () => {
            await expect(Metar.get('NONEXISTING')).rejects.toThrow('Request failed with status code 404');
        });
    });
});
