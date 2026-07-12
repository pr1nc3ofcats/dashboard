import { useSound } from "@vueuse/sound";
import Navigation from '../assets/sound/sfx/deck_ui_navigation.wav'
import Activation from '../assets/sound/sfx/deck_ui_default_activation.wav'
import { Settings } from "../models/settings";
import { convertFileSrc } from "@tauri-apps/api/core";
import { watch } from "vue";
import { onAfterAppMount } from "./dependencyInjector";

const backgroundMusic = new Audio();
backgroundMusic.loop = true;

export function useAudioManager() {
    const settings = Settings.getData();

    const sfxNav = useSound(Navigation, { volume: settings.sfx_volume });
    const sfxActivate = useSound(Activation, { volume: settings.sfx_volume });

    return { sfxNav, sfxActivate }
}

onAfterAppMount(() => {
    const settings = Settings.getData();

    watch(
        () => settings.background_music,
        (path) => {
            if (!path) return;

            backgroundMusic.src = convertFileSrc(path);
            backgroundMusic.play();
        },
        { immediate: true }
    );
    watch(
        () => settings.background_music_volume,
        (volume) => {
            backgroundMusic.volume = volume;
        },
        { immediate: true }
    );
})