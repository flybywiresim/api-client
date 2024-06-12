import { NXApi } from '../index';
import { get } from '../utils';

export declare class CommitInfo {
    sha: string;

    shortSha: string;

    timestamp: Date;
}

export declare class ReleaseInfo {
    name: string;

    isPreRelease: boolean;

    publishedAt: Date;

    htmlUrl: string;

    body: string;
}

export declare class PullLabel {
    id: string;

    name: string;

    color: string;
}

export declare class PullInfo {
    number: number;

    title: string;

    author: string;

    labels: PullLabel[];

    isDraft: boolean;
}

export declare class ArtifactInfo {
    artifactUrl: string;
}

export class GitVersions {
    public static async getNewestCommit(user: string, repo: string, branch: string): Promise<CommitInfo> {
        if (!user || !repo || !branch) {
            throw new Error('Missing argument');
        }

        return get<CommitInfo>(new URL(`/api/v1/git-versions/${user}/${repo}/branches/${branch}`, NXApi.url))
            .then((res: CommitInfo) => ({
                ...res,
                timestamp: new Date(res.timestamp),
            }));
    }

    public static async getReleases(user: string, repo: string, includePreReleases?: boolean, skip?: number, take?: number): Promise<ReleaseInfo[]> {
        if (!user || !repo) {
            throw new Error('Missing argument');
        }

        if (skip < 0 || take < 0) {
            throw new Error("skip or take cannot be negative");
        }

        const takePreReleasesArg = `?includePreReleases=${includePreReleases === true}`;
        const skipArg = skip !== undefined ? `&skip=` + skip : "";
        const takeArg = take !== undefined ? `&take=` + take : "";

        return get<ReleaseInfo[]>(
            new URL(`/api/v1/git-versions/${user}/${repo}/releases${takePreReleasesArg}${skipArg}${takeArg}`, NXApi.url),
        )
            .then((res) => res.map((rel) => ({
                ...rel,
                publishedAt: new Date(rel.publishedAt),
            })));
    }

    public static async getPulls(user: string, repo: string): Promise<PullInfo[]> {
        if (!user || !repo) {
            throw new Error('Missing argument');
        }

        return get<PullInfo[]>(new URL(`/api/v1/git-versions/${user}/${repo}/pulls`, NXApi.url));
    }

    public static async getArtifact(user: string, repo: string, pull: string): Promise<ArtifactInfo> {
        if (!user || !repo || !pull) {
            throw new Error('Missing argument');
        }

        return get<ArtifactInfo>(new URL(`/api/v1/git-versions/${user}/${repo}/pulls/${pull}/artifact`, NXApi.url));
    }
}
