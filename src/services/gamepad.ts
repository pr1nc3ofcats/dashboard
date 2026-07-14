import { mapGamepadToXbox360Controller, useGamepad } from '@vueuse/core';
import { computed, inject, ref, watch } from 'vue';
import router from '../router';
import { onAfterAppMount, onWindowFocus, onWindowUnfocus } from './dependencyInjector';

const { pause, resume, gamepads, onConnected, onDisconnected } = useGamepad();
const currentGamepadIndex = ref(0);

const currentGamepadMapped = computed(() => {
    const gp = gamepads.value[currentGamepadIndex.value]
    return gp ? mapGamepadToXbox360Controller(ref(gp)).value : undefined
})

onConnected((i: number) => {
    console.log("Gamepad ", gamepads.value[i].id, " is connected");
    currentGamepadIndex.value = i;
})
onDisconnected((i: number) => {
    console.log("Gamepad ", gamepads.value[i].id, " is disconnected");
    currentGamepadIndex.value = Math.max(0, gamepads.value.length - 1);
})

function dispatchKeyEvents(key: string, code: string, keyCode: number) {
    const keydownEvent = new KeyboardEvent('keydown', {
        key,
        code,
        isComposing: false,
        keyCode,
        bubbles: true,
    });

    const keyupEvent = new KeyboardEvent('keyup', {
        key,
        code,
        isComposing: false,
        keyCode,
        bubbles: true,
    });

    document.dispatchEvent(keydownEvent);
    document.dispatchEvent(keyupEvent);
};

function initBasicWatchers() {
    watch(() => currentGamepadMapped.value?.buttons.a.pressed, (v) => {
        if (v) dispatchKeyEvents('Enter', 'Enter', 13);
    });

    watch(() => currentGamepadMapped.value?.dpad.up.pressed, (v) => {
        if (v) dispatchKeyEvents('ArrowUp', 'ArrowUp', 38);
    });
    watch(() => currentGamepadMapped.value?.dpad.down.pressed, (v) => {
        if (v) dispatchKeyEvents('ArrowDown', 'ArrowDown', 40);
    });

    watch(() => currentGamepadMapped.value?.dpad.left.pressed, (v) => {
        if (v) dispatchKeyEvents('ArrowLeft', 'ArrowLeft', 37);
    });

    watch(() => currentGamepadMapped.value?.dpad.right.pressed, (v) => {
        if (v) dispatchKeyEvents('ArrowRight', 'ArrowRight', 39);
    });

    watch(() => Math.round(currentGamepadMapped.value?.stick.left.vertical * 1000) / 1000, (v) => {
        if (v == 1)
            dispatchKeyEvents('ArrowDown', 'ArrowDown', 40);
        else if (v == -1)
            dispatchKeyEvents('ArrowUp', 'ArrowUp', 38);
    });
    watch(() => Math.round(currentGamepadMapped.value?.stick.left.horizontal * 1000) / 1000, (v) => {
        if (v == 1)
            dispatchKeyEvents('ArrowRight', 'ArrowRight', 39);
        else if (v == -1)
            dispatchKeyEvents('ArrowLeft', 'ArrowLeft', 37);
    });

    // Rb Lb
    // Looks like shit
    // TODO: unshit
    watch(() => currentGamepadMapped.value?.bumper.left.pressed, (v) => {
        if (v) {
            const currentRouteName = router.currentRoute.value.name?.toString();
            switch (currentRouteName) {
                case "home":
                    router.push({ name: "settings" })
                    break;
                case "library":
                    router.push({ name: "home" })
                    break;
                case "settings":
                    router.push({ name: "library" })
                    break;
                default:
                    break;
            }
        }
    });
    watch(() => currentGamepadMapped.value?.bumper.right.pressed, (v) => {
        if (v) {
            const currentRouteName = router.currentRoute.value.name?.toString();
            switch (currentRouteName) {
                case "home":
                    router.push({ name: "library" })
                    break;
                case "library":
                    router.push({ name: "settings" })
                    break;
                case "settings":
                    router.push({ name: "home" })
                    break;
                default:
                    break;
            }
        }
    });
}

onAfterAppMount(initBasicWatchers);
onWindowFocus(resume);
onWindowUnfocus(pause);