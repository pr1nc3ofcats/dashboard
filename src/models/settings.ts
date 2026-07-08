import { invoke } from "@tauri-apps/api/core";

interface SettingsData {
    accent_color: string;
    wallapper: string;
    avatar_image: string;
}

export class Settings {
    private static instance: Settings;
    private data!: SettingsData;

    public static async init() {
        if (!this.instance) {
            this.instance = new Settings;
            this.instance.data = await invoke('parse_settings');
        }
    }

    public static get<K extends keyof SettingsData>(k: K) {
        return this.instance.data[k];
    }

    public static async set<K extends keyof SettingsData, V extends SettingsData[K] >(k: K, v: V) {
        this.instance.data[k] = v;
        try {
            await invoke('dump_settings', { settings: Settings.instance.data});
        } catch (err) {
            console.error(err);
        }
    }
}