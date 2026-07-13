import { invoke } from "@tauri-apps/api/core";
import { reactive, watch, WatchCallback } from "vue";

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

    public static watch<K extends keyof SettingsData>(prop: K, f: WatchCallback, immediate: boolean = false) {
        return watch(() => this.data[prop], f, { immediate: immediate })
    }

    public static async init() {
        Object.assign(this.data, await invoke<SettingsData>("parse_settings"));
        invoke('dump_settings', { settings: { ...this.data } }).catch((err) => console.error(err));
    }

    public static get<K extends keyof SettingsData>(k: K) {
        return this.data[k]
    }

    public static set<K extends keyof SettingsData, V extends SettingsData[K]>(k: K, v: V) {
        this.data[k] = v;
        invoke('dump_settings', { settings: { ...this.data } }).catch((err) => console.error(err));
    }
}