export interface Application {
    id: number;
    title: string;
    command: string[];
    imgSquare: string;
    categories: string[];
    playtime: number;
    lastLaunched?: Date;
    shortDescription?: string;
    dataPath?: string;

    steamDetails?: SteamDetails;
}

export interface SteamDetails {
    imgHero?: string; // 16:9
    imgSteamHorizontal?: string; // 92:43
    screeenshots?: string[];
    detailedDescription?: string;
    releaseDate?: Date;
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