import { fetch } from "@tauri-apps/plugin-http";
import { HowLongToBeat } from "../../types/application";

// Yes, you guessed it

const HLTB_PROXY_BASE = "https://hltbapi.codepotatoes.de";

export interface HltbProxyResult {
    id: number;
    hltbId: number;
    title: string;
    imageUrl: string;
    steamAppId: number | null;
    gogAppId: number | null;
    mainStory: number; // hours
    mainStoryWithExtras: number; // hours
    completionist: number; // hours
    lastUpdatedAt: string; // ISO date string
}

export async function getHltbBySteamAppId(
    steamAppId: number
): Promise<HltbProxyResult | undefined> {
    const res = await fetch(`${HLTB_PROXY_BASE}/steam/${steamAppId}`);

    if (res.status === 404) return undefined;
    if (!res.ok) {
        throw new Error(`HLTB proxy request failed: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as HltbProxyResult;
}

export function toHowLongToBeat(result: HltbProxyResult): HowLongToBeat {
    return {
        main_story: result.mainStory,
        main_plus_sides: result.mainStoryWithExtras,
        completionist: result.completionist,
    };
}