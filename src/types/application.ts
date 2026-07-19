export interface Application {
    id: number;
    title: string;
    command: string[];
    img_square: string;
    categories: string[];
    playtime: number;

    last_launched?: Date;
    data_path?: string;

    steam_details?: SteamDetails;
    steam_drid_db_data?: SteamGridDbData;
    how_long_to_beat?: HowLongToBeat;
}

export interface SteamDetails {
    screeenshots?: string[];

    short_description?: string;
    detailed_description?: string;

    release_date?: Date;

    developers?: string[];
    publishers?: string[];

    pc_requirements?: {
        minimal: string;
        recommended: string;
    };
    linuxRequirements?: {
        minimal: string;
        recommended: string;
    };
    controllerSupport?: string;

    achievements?: Achievement[];
}

export interface SteamGridDbData {
    img_hero?: string; // 16:9
    img_steam_horizontal?: string; // 92:43
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