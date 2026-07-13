import Navigation from '../assets/sound/sfx/deck_ui_navigation.wav'
import Activation from '../assets/sound/sfx/deck_ui_default_activation.wav'
import { Settings } from "../models/settings";
import { convertFileSrc } from "@tauri-apps/api/core";
import { onAfterAppMount, onWindowFocus, onWindowUnfocus } from "./dependencyInjector";
import { WatchCallback } from "vue";
import { Howl } from 'howler';

const sfxNav = new Howl({ src: [Navigation] });
const sfxActivate = new Howl({ src: [Activation] });
const backgroundMusic = new Audio();
backgroundMusic.loop = true;

let sfxVolumeWatch: WatchCallback | undefined = undefined;
export function useAudioManager() {
    if (!sfxVolumeWatch) {
        sfxVolumeWatch = Settings.watch("sfx_volume", (volume) => {
            sfxNav.volume(volume);
            sfxActivate.volume(volume)
        }, true);
    }

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