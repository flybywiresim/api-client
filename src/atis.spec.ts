import { Atis } from './index';

describe('ATIS', () => {
    test('should return an ATIS response', async () => {
        const res = await Atis.get('KJFK');
        console.log(res);

        expect(res.icao).toEqual('KJFK');
        expect(res.source).toEqual('FAA');
    });

    test('should allow selection of sources', async () => {
        const res = await Atis.get('KJFK', 'FAA');
        console.log(res);

        expect(res.icao).toEqual('KJFK');
        expect(res.source).toEqual('FAA');
    });

    describe('error handling', () => {
        test('should require an ICAO', async () => {
            await expect(Atis.get('')).rejects.toThrow('No ICAO provided');
        });

        test('should 404 on unknown ICAOs', async () => {
            await expect(Atis.get('NONEXISTING')).rejects.toThrow('Request failed with status code 404');
        });
    });
});
