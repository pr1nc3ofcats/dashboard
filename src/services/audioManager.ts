import { useSound } from "@vueuse/sound";
import Navigation from '../assets/sound/sfx/deck_ui_navigation.wav'
import Activation from '../assets/sound/sfx/deck_ui_default_activation.wav'
import { Settings } from "../models/settings";
import { convertFileSrc } from "@tauri-apps/api/core";
import { onAfterAppMount, onWindowFocus, onWindowUnfocus } from "./dependencyInjector";
import { ref } from "vue";

const backgroundMusic = new Audio();
backgroundMusic.loop = true;

export function useAudioManager() {
    const sfxNav = ref(useSound(Navigation, { volume: Settings.get("sfx_volume") }));
    const sfxActivate = ref(useSound(Activation, { volume: Settings.get("sfx_volume") }));

    Settings.watch("sfx_volume", (volume) => {
        sfxNav.value = useSound(Navigation, { volume: volume });
        sfxActivate.value = useSound(Activation, { volume: volume });
    });

    return { sfxNav, sfxActivate }
}

onAfterAppMount(() => {
    Settings.watch("background_music", (path) => {
        if (!path) return;

        backgroundMusic.src = convertFileSrc(path);
        backgroundMusic.play();
    }, true);

    Settings.watch("background_music_volume", (volume) => {
        backgroundMusic.volume = volume;
    }, true);
})

onWindowUnfocus(() => backgroundMusic.pause());
onWindowFocus(() => backgroundMusic.play());