import { SteamDetails } from "../../types/application";
import { fetch } from '@tauri-apps/plugin-http';

// Beware of vibecode

const SEARCH_URL = "https://store.steampowered.com/api/storesearch/";
const APPDETAILS_URL = "https://store.steampowered.com/api/appdetails";

interface SteamSearchResult {
    appid: number;
    name: string;
}

interface SteamAppDetailsResponse {
    [appid: string]: {
        success: boolean;
        data?: {
            name: string;
            short_description?: string;
            detailed_description?: string;
            developers?: string[];
            publishers?: string[];
            release_date?: { coming_soon: boolean; date: string };
            pc_requirements?: { minimum?: string; recommended?: string } | any[];
            linux_requirements?: { minimum?: string; recommended?: string } | any[];
            header_image?: string;
            screenshots?: { id: number; path_thumbnail: string; path_full: string }[];
            controller_support?: string;
        };
    };
}

export async function searchSteamApp(
    name: string,
    countryCode: string,
    language: string
): Promise<SteamSearchResult[]> {
    const url = `${SEARCH_URL}?term=${encodeURIComponent(name)}&l=${language}&cc=${countryCode}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Steam search failed: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const items = (json?.items ?? []) as any[];
    return items.map((item) => ({ appid: item.id, name: item.name }));
}

function pickBestMatch(
    results: SteamSearchResult[],
    title: string
): SteamSearchResult | undefined {
    const lower = title.trim().toLowerCase();
    return (
        results.find((r) => r.name.trim().toLowerCase() === lower) ?? results[0]
    );
}

export async function getAppDetails(
    appid: number,
    countryCode: string = "us",
    language: string = "english",
): Promise<SteamAppDetailsResponse[string]["data"] | undefined> {
    const url = `${APPDETAILS_URL}?appids=${appid}&l=${language}&cc=${countryCode}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Steam appdetails failed: ${res.status} ${res.statusText}`);
    }
    const json = (await res.json()) as SteamAppDetailsResponse;
    const entry = json[String(appid)];
    if (!entry?.success) return undefined;
    return entry.data;
}

// steam sometimes returns an empty array instead of an object
function normalizeRequirements(
    req: { minimum?: string; recommended?: string } | any[] | undefined
): { minimal: string; recommended: string } | undefined {
    if (!req || Array.isArray(req)) return undefined;
    return {
        minimal: req.minimum ?? "",
        recommended: req.recommended ?? "",
    };
}

function toSteamDetails(
    data: NonNullable<Awaited<ReturnType<typeof getAppDetails>>>
): SteamDetails {
    return {
        screeenshots: data.screenshots?.map((s) => s.path_full),
        img_steam_horizontal: data.header_image,
        short_description: data.short_description,
        detailed_description: data.detailed_description,
        release_date: data.release_date?.date
            ? new Date(data.release_date.date)
            : undefined,
        developers: data.developers,
        publishers: data.publishers,
        pc_requirements: normalizeRequirements(data.pc_requirements),
        linux_requirements: normalizeRequirements(data.linux_requirements),
        controller_support: data.controller_support,
    };
}

// Fallbacks to english data if not found anything for language from settings
export async function fetchSteamDetailsByName(
    title: string,
    countryCode = "us",
    language = "english"
): Promise<[SteamDetails | undefined, number]> {
    const results = await searchSteamApp(title, countryCode, language);
    if (results.length === 0) return [undefined, 0];

    const match = pickBestMatch(results, title);
    if (!match) return [undefined, 0];

    const data = await getAppDetails(match.appid, countryCode, language);
    if (!data) {
        const fallback_data = await getAppDetails(match.appid);
        if (fallback_data) {
            return [toSteamDetails(fallback_data), match.appid];
        }
        return [undefined, 0];
    }

    return [toSteamDetails(data), match.appid];
}