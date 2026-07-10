export interface Application {
    id: number;
    title: string;
    command: string[];
    imgSquare: string;
    categories: string[];
    lastLaunched: Date;
    shortDescription?: string;
    dataPath?: string;

    steamDetails?: SteamDetails;
}

export interface SteamDetails {
    imgBackground?: string; // 16:9
    imgSteamHorizontal?: string; // 92:43
    screeenshots?: string[];
    detailedDescription?: string;
    releaseDate?: string;
    developers?: string[];
    publishers?: string[];
    pcRequirements?: {
        minimal: string;
        recommended: string;
    };
    linuxRequirements?: {
        minimal: string;
        recommended: string;
    };
    playtimeSeconds?: number;
    achievements?: Achievement[];
    howLongToBeat?: {
        mainStory: number;
        mainPlusSides: number;
        completionist: number;
    };

    steamId?: number;
}

export interface Achievement {
    img: string;
    name: string;
    achieved: boolean;
}