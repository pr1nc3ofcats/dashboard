import { fetch } from "@tauri-apps/plugin-http";
import { Settings } from "../../models/settings";

// Beware of vibecode

const BASE_URL = "https://www.steamgriddb.com/api/v2";

let apiKey: string;
Settings.watch('sgdb_api_key', () => apiKey = Settings.get('sgdb_api_key'), true);

interface SgdbResponse<T> {
    success: boolean;
    data: T;
    errors?: string[];
}

export interface SgdbImage {
    id: number;
    score: number;
    style: string; // e.g. "alternate", "blurred", "white_logo", "material", "no_logo"
    url: string;
    thumb: string;
    tags: string[];
    author: {
        name: string;
        steam64: string;
        avatar: string;
    };
    width: number;
    height: number;
    nsfw: boolean;
    humor: boolean;
    notes: string | null;
    mime: string; // "image/png" | "image/jpeg" | "image/webp"
    language: string;
}

function authHeaders(): HeadersInit {
    return {
        Authorization: `Bearer ${apiKey}`,
    };
}

async function sgdbGet<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });

    if (res.status === 404) {
        throw new Error("SteamGridDB: game not found");
    }
    if (!res.ok) {
        throw new Error(`SteamGridDB request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as SgdbResponse<T>;
    if (!json.success) {
        throw new Error(`SteamGridDB error: ${json.errors?.join(", ") ?? "unknown"}`);
    }
    return json.data;
}

export async function getGridsBySteamAppId(
    steamAppId: number,
    options?: { dimensions?: string[]; styles?: string[]; nsfw?: boolean }
): Promise<SgdbImage[]> {
    const params = new URLSearchParams();
    if (options?.dimensions) params.set("dimensions", options.dimensions.join(","));
    if (options?.styles) params.set("styles", options.styles.join(","));
    if (options?.nsfw !== undefined) params.set("nsfw", String(options.nsfw));

    const qs = params.toString() ? `?${params.toString()}` : "";
    return sgdbGet<SgdbImage[]>(`/grids/steam/${steamAppId}${qs}`);
}

// Squares
export async function getSquareGridsBySteamAppId(
    steamAppId: number,
    options?: { styles?: string[]; nsfw?: boolean }
): Promise<SgdbImage[]> {
    return getGridsBySteamAppId(steamAppId, {
        ...options,
        dimensions: ["512x512", "1024x1024"],
    });
}

// Heroes
export async function getHeroesBySteamAppId(steamAppId: number): Promise<SgdbImage[]> {
    return sgdbGet<SgdbImage[]>(`/heroes/steam/${steamAppId}`);
}

// Logos
export async function getLogosBySteamAppId(steamAppId: number): Promise<SgdbImage[]> {
    return sgdbGet<SgdbImage[]>(`/logos/steam/${steamAppId}`);
}

// Icons
export async function getIconsBySteamAppId(steamAppId: number): Promise<SgdbImage[]> {
    return sgdbGet<SgdbImage[]>(`/icons/steam/${steamAppId}`);
}

// -------- Search by name --------

export interface SgdbGame {
    id: number;
    name: string;
    types: string[]; // e.g. ["steam", "gog"]
    verified: boolean;
}

async function searchGamesByName(name: string): Promise<SgdbGame[]> {
    return sgdbGet<SgdbGame[]>(`/search/autocomplete/${encodeURIComponent(name)}`);
}

export async function findBestGameMatch(name: string): Promise<SgdbGame | undefined> {
    const results = await searchGamesByName(name);
    return results[0];
}


async function getGridsByGameId(
    gameId: number,
    options?: { dimensions?: string[]; styles?: string[]; nsfw?: boolean }
): Promise<SgdbImage[]> {
    const params = new URLSearchParams();
    if (options?.dimensions) params.set("dimensions", options.dimensions.join(","));
    if (options?.styles) params.set("styles", options.styles.join(","));
    if (options?.nsfw !== undefined) params.set("nsfw", String(options.nsfw));

    const qs = params.toString() ? `?${params.toString()}` : "";
    return sgdbGet<SgdbImage[]>(`/grids/game/${gameId}${qs}`);
}

// Squares
export async function getSquareGridsByName(
    name: string,
    options?: { styles?: string[]; nsfw?: boolean }
): Promise<SgdbImage[]> {
    const game = await findBestGameMatch(name);
    if (!game) return [];
    return getGridsByGameId(game.id, {
        ...options,
        dimensions: ["512x512", "1024x1024"],
    });
}

// Heroes
export async function getHeroesByName(name: string): Promise<SgdbImage[]> {
    const game = await findBestGameMatch(name);
    if (!game) return [];
    return sgdbGet<SgdbImage[]>(`/heroes/game/${game.id}`);
}

// Logos
export async function getLogosByName(name: string): Promise<SgdbImage[]> {
    const game = await findBestGameMatch(name);
    if (!game) return [];
    return sgdbGet<SgdbImage[]>(`/logos/game/${game.id}`);
}

// Icons
export async function getIconsByName(name: string): Promise<SgdbImage[]> {
    const game = await findBestGameMatch(name);
    if (!game) return [];
    return sgdbGet<SgdbImage[]>(`/icons/game/${game.id}`);
}
