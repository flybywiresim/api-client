import { GitVersions } from './index';

describe('GitVersions', () => {
    describe('Get newest commit', () => {
        test('should return return newest commit', async () => {
            await expect(GitVersions.getNewestCommit('flybywiresim', 'a32nx', 'master'))
                .resolves.toMatchObject({
                    sha: expect.any(String),
                    shortSha: expect.any(String),
                    timestamp: expect.any(Date),
                });
        });

        test('should require all arguments', async () => {
            await expect(GitVersions.getNewestCommit('', '', ''))
                .rejects.toThrow('Missing argument');
        });
    });

    describe('Get releases', () => {
        test('should return return all releases', async () => {
            await expect(GitVersions.getReleases('flybywiresim', 'a32nx'))
                .resolves.toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        publishedAt: expect.any(Date),
                        htmlUrl: expect.any(String),
                        body: expect.any(String),
                    }),
                ]));
        });

        test('should require all arguments', async () => {
            await expect(GitVersions.getReleases('', ''))
                .rejects.toThrow('Missing argument');
        });
    });

    describe('Get pulls', () => {
        test('should return return all pulls', async () => {
            await expect(GitVersions.getPulls('flybywiresim', 'a32nx'))
                .resolves.toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        number: expect.any(Number),
                        title: expect.any(String),
                        author: expect.any(String),
                        labels: expect.any(Array),
                        isDraft: expect.any(Boolean),
                    }),
                ]));
        });

        test('should require all arguments', async () => {
            await expect(GitVersions.getPulls('', ''))
                .rejects.toThrow('Missing argument');
        });
    });

    describe('Get artifact', () => {
        test('should return return an artifact for a PR', async () => {
            await expect(GitVersions.getArtifact('flybywiresim', 'a32nx', '1'))
                .resolves.toMatchObject({ artifactUrl: '' });
        });

        test('should require all arguments', async () => {
            await expect(GitVersions.getArtifact('', '', ''))
                .rejects.toThrow('Missing argument');
        });
    });
});
