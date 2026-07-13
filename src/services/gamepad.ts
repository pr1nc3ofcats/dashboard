import { mapGamepadToXbox360Controller, useGamepad } from '@vueuse/core';
import { computed, inject, ref, watch } from 'vue';
import router from '../router';
import { onAfterAppMount, onWindowFocus, onWindowUnfocus } from './dependencyInjector';

const { pause, resume, gamepads, onConnected, onDisconnected } = useGamepad();
const currentGamepadIndex = ref(0);

const currentGamepadMapped = computed(() => {
    const gp = gamepads.value[0]
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

function initBasicWatchers(spatialNavigation: any) {
    // BUTTON A
    watch(() => currentGamepadMapped.value?.buttons.a.pressed, (v) => {
        if (v) {
            const keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                isComposing: false,
                keyCode: 13,
                bubbles: true,
            });

            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                isComposing: false,
                keyCode: 13,
                bubbles: true,
            });

            document.dispatchEvent(keydownEvent);
            document.dispatchEvent(keyupEvent);
        }
    });

    // D-PAD
    watch(() => currentGamepadMapped.value?.dpad.up.pressed, (v) => {
        if (v) spatialNavigation.move('up')
    });
    watch(() => currentGamepadMapped.value?.dpad.down.pressed, (v) => {
        if (v) spatialNavigation.move('down')
    });

    watch(() => currentGamepadMapped.value?.dpad.left.pressed, (v) => {
        if (v) spatialNavigation.move('left')
    });

    watch(() => currentGamepadMapped.value?.dpad.right.pressed, (v) => {
        if (v) spatialNavigation.move('right')
    });

    // Sticks
    watch(() => currentGamepadMapped.value?.stick.left.vertical.toPrecision(1), (v) => {
        if (v === "1")
            spatialNavigation.move('down');
        else if (v === "-1")
            spatialNavigation.move('up');
    });
    watch(() => currentGamepadMapped.value?.stick.left.horizontal.toPrecision(1), (v) => {
        if (v === "1")
            spatialNavigation.move('right');
        else if (v === "-1")
            spatialNavigation.move('left');
    });

    // Rb Lb
    // Looks like shit
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

onAfterAppMount(() => initBasicWatchers(inject('spatialNavigation')));
onWindowFocus(resume);
onWindowUnfocus(pause);