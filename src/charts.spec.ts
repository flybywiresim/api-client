import { Charts } from './index';

describe('Charts', () => {
    test('should return a charts response', async () => {
        await expect(Charts.get('KJFK')).resolves.toMatchObject({
            icao: 'KJFK',
        });
    });

    describe('error handling', () => {
        test('should require an ICAO', async () => {
            await expect(Charts.get('')).rejects.toThrow('No ICAO provided');
        });
    });
});
