import { useAudioManager } from "./audioManager";
import { onAfterAppMount } from "./dependencyInjector";
import { performPulse } from "./stylingHelper";

export function onViewMountedHook() {
    const { sfxNav, sfxActivate } = useAudioManager();

    document.querySelectorAll('.sfx-nav-handler').forEach((el) => {
        el.addEventListener('sn:focused', () => sfxNav.play());
    })
    document.querySelectorAll('.sfx-activation-handler').forEach((el) => {
        el.addEventListener('sn:enter-down', () => sfxActivate.play());
    })
    document.querySelectorAll('.pulse-handler').forEach((el) => {
        el.addEventListener('sn:enter-down', performPulse);
    })
}

onAfterAppMount(onViewMountedHook);