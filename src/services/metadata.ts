import { Settings } from "../models/settings";
import { Application, HowLongToBeat, SteamDetails, SteamGridDbData } from "../types/application";
import { getHltbBySteamAppId, toHowLongToBeat } from "./api/howLongToBeat";
import { fetchSteamDetailsByName } from "./api/steamDetails";
import { getHeroesByName, getHeroesBySteamAppId, getSquareGridsByName, getSquareGridsBySteamAppId, SgdbImage } from "./api/steamGridDb";

function sortBySgdbImagesByKeywords(target: SgdbImage[], keywords: string[]) {
    const keywordMatch = (item: SgdbImage): boolean => keywords.some((kw) => item.notes && item.notes.toLowerCase().includes(kw));
    target.sort((a, b) => Number(keywordMatch(b)) - Number(keywordMatch(a)));
}

function sortSquares(target: SgdbImage[]) {
    sortBySgdbImagesByKeywords(target, ["xbox", "playstation"]);
}

function sortHeroes(target: SgdbImage[]) {
    sortBySgdbImagesByKeywords(target, [" art ", " artwork "]);
}

export async function tryGetFullMetadata(target: Application) {
    try {
        let [steamDetails, steamId] = await fetchSteamDetailsByName(target.title, Settings.get('country_code'), Settings.get('language'));
        if (steamDetails) target.steam_details = steamDetails;

        let squares: SgdbImage[];
        let heroes: SgdbImage[];
        if (steamId) {
            squares = await getSquareGridsBySteamAppId(steamId);
            heroes = await getHeroesBySteamAppId(steamId);
        } else {
            squares = await getSquareGridsByName(target.title);
            heroes = await getHeroesByName(target.title);
        }
        sortSquares(squares);
        sortHeroes(heroes);

        let sgdb_data: SteamGridDbData;
        if (squares.length > 0) target.img_square = squares[0].url;
        if (heroes.length > 0) sgdb_data.img_hero = heroes[0].url;
        target.steam_drid_db_data = sgdb_data;

        if (steamId) {
            const hltb = toHowLongToBeat(await getHltbBySteamAppId(steamId));
            target.how_long_to_beat = hltb;
        }
    } catch (err) {
        console.error(err);
    }
}