import { convertFileSrc } from "@tauri-apps/api/core";
import { Settings } from "../models/settings";
import { Application, SteamGridDbData } from "../types/application";
import { getHltbBySteamAppId, toHowLongToBeat } from "./api/howLongToBeat";
import { fetchSteamDetailsByName } from "./api/steamDetails";
import { getHeroesByName, getHeroesBySteamAppId, getSquareGridsByName, getSquareGridsBySteamAppId, SgdbImage } from "./api/steamGridDb";
import { useSgdbModal } from "../view_models/modals/sgdbViewModel";

function sortBySgdbImagesByKeywords(target: SgdbImage[], keywords: string[]) {
    const keywordMatch = (item: SgdbImage): boolean => keywords.some((kw) => item.notes && item.notes.toLowerCase().includes(kw));
    return target.toSorted((a, b) => Number(keywordMatch(b)) - Number(keywordMatch(a)));
}

function tidySquares(target: SgdbImage[]) {
    const filtered = target.filter((img) => img.author.steam64 !== "76561199048283361") // Ugly images whith steam logo and borders
    return sortBySgdbImagesByKeywords(filtered, ["xbox", "playstation"]);
}

function tidyHeroes(target: SgdbImage[]) {
    const sorted = sortBySgdbImagesByKeywords(target, [" art ", " artwork "]);
    return sortBySgdbImagesByKeywords(sorted, [" ps5 "]);
}

export async function tryGetFullMetadata(target: Application) {
    let [steamDetails, steamId] = await fetchSteamDetailsByName(target.title, Settings.get('country_code'), Settings.get('language'));
    if (steamDetails) target.steam_details = steamDetails;

    let squares: SgdbImage[];
    let heroes: SgdbImage[];
    if (steamId) {
        target.id = steamId;

        squares = await getSquareGridsBySteamAppId(steamId);
        heroes = await getHeroesBySteamAppId(steamId);
    } else {
        squares = await getSquareGridsByName(target.title);
        heroes = await getHeroesByName(target.title);
    }
    squares = tidySquares(squares);
    heroes = tidyHeroes(heroes);

    let sgdb_data: SteamGridDbData = {};
    
    if (squares.length > 0) target.img_square = squares[0].url;
    if (heroes.length > 0) {
        let selectedImage = await useSgdbModal(heroes);
        sgdb_data.img_hero = selectedImage.url;
    }

    target.steam_drid_db_data = sgdb_data;

    if (steamId) {
        const hltb = toHowLongToBeat(await getHltbBySteamAppId(steamId));
        target.how_long_to_beat = hltb;
    }

}

export function getResourceUrl(target: string) {
    return target.startsWith("http") ? target : convertFileSrc(target);
}