import { useAudioManager } from "./audioManager";
import { performPulse } from "./stylingHelper";

const { sfxNav, sfxActivate } = useAudioManager();
const sfxNavPlay = () => sfxNav.play();
const sfxActivatePlay = () => sfxActivate.play();

export function onViewUpdatedHook() {
    document.querySelectorAll('.sfx-nav-handler').forEach((el) => {
        el.addEventListener('sn:focused', sfxNavPlay);
    })
    document.querySelectorAll('.sfx-activation-handler').forEach((el) => {
        el.addEventListener('sn:enter-down', sfxActivatePlay);
    })
    document.querySelectorAll('.pulse-handler').forEach((el) => {
        el.addEventListener('sn:enter-down', performPulse);
    })
}