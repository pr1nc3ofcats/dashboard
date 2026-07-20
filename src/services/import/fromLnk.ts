import { invoke } from "@tauri-apps/api/core";
import { Application } from "../../types/application";
import { tryGetFullMetadata } from "../metadata";
import dayjs from "dayjs";
import { Library } from "../../models/library";
import { basename } from "@tauri-apps/api/path";

export async function tryAddGameFromLnk(file: string) {
    let result: Application = {
        id: 0,
        title: '',
        command: [],
        img_square: '',
        categories: ["Games"],
        playtime: 0,
    };
    let title = (await basename(file)).split('.')[0];
    result.title = title;

    let linkData = await invoke<LinkData>('read_lnk_file', { path: file });
    result.command = linkData.command;
    result.data_path = linkData.working_dir;

    await tryGetFullMetadata(result);
    if (!result.img_square) throw new Error('Failed to find a 1:1 image for this game');
    if (!result.id) result.id = dayjs().unix();

    Library.add(result);
}