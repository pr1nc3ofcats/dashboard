export interface Application {
    id: number;
    title: string;
    command: string[];
    imgSquare: string;
    categories: string[];
    playtime: number;
    lastLaunched?: Date;
    dataPath?: string;

    steamDetails?: SteamDetails;
    howLongToBeat?: HowLongToBeat;
}

export interface SteamDetails {
    imgHero?: string; // 16:9
    imgSteamHorizontal?: string; // 92:43
    screeenshots?: string[];

    shortDescription?: string;
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
    controllerSupport?: string;

    achievements?: Achievement[];

    steamId?: number;
}

export interface HowLongToBeat {
    mainStory: number;
    mainPlusSides: number;
    completionist: number;
}

export interface Achievement {
    img: string;
    name: string;
    achieved: boolean;
}