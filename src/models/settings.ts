import { invoke } from "@tauri-apps/api/core";
import { reactive } from "vue";

interface SettingsData {
    accent_color: string;
    wallapper: string;
    avatar_image: string;

    sfx_volume: number;
    background_music: string,
    background_music_volume: number
}

export class Settings {
    private static data = reactive({
        accent_color: '',
        wallapper: '',
        avatar_image: '',

        sfx_volume: 0,
        background_music: '',
        background_music_volume: 0
    });

    public static getData() {
        return this.data
    }

    public static async init() {
        Object.assign(this.data, await invoke<SettingsData>("parse_settings"));
    }

    public static async set<K extends keyof SettingsData, V extends SettingsData[K]>(k: K, v: V) {
        this.data[k] = v;
        try {
            await invoke('dump_settings', { settings: { ...this.data } });
        } catch (err) {
            console.error(err);
        }
    }
}