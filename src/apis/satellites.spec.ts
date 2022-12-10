import { GNSS } from './satellites';

describe('GNSS', () => {
    test('should return a GNSS response array', async () => {
        await expect(GNSS.get()).resolves.toMatchObject(expect.any(Array));
    });
});
