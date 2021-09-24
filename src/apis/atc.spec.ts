import { ATC } from './atc';

describe('ATC', () => {
    test('should return an ATC response', async () => {
        await expect(ATC.get('vatsim'))
            .resolves.toMatchObject(expect.any(Array));
    });

    describe('error handling', () => {
        test('should require a valid source', async () => {
            await expect(ATC.get('')).rejects.toThrow('No source provided');
        });
    });
});
