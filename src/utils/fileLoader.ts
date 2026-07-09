import { convertFileSrc } from "@tauri-apps/api/core";
import { appLocalDataDir, join } from "@tauri-apps/api/path";

export async function getLocalFileUrl(path: string) {
    const baseDir = await appLocalDataDir();
    const fullPath = await join(baseDir, path);
    return await convertFileSrc(fullPath);
}