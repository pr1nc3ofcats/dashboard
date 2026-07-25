import { computed, Ref, ref } from "vue";
import { Library } from "../models/library";
import { Application } from "../types/application";
import { getResourceUrl } from "../services/metadata";
import { ControllerButton } from "../services/gamepad";

const currentId = ref(-1);
const appsStripped: Ref<Application[], Application[]> = ref([]);

const appIsSelected = computed(() => {
    return Library.get(currentId.value) ? true : false;
});
const appIsGame = computed(() => {
    let app = Library.get(currentId.value);
    return app ? app.categories.includes("Games") : false;
});
const controllerHints = computed<{
    buttonType: ControllerButton,
    label: string
}[]>(() => {
    return [{
        buttonType: 'a',
        label: appIsGame.value ? "Play" : "Launch"
    },
    {
        buttonType: 'y',
        label: appIsGame.value ? "Game page" : "Manage"
    }]
});

const preloadContainer = computed(() => {
    let preloadImages = [];
    for (let app of appsStripped.value) {
        if (app?.steam_drid_db_data?.img_hero) {
            let preload = new Image();
            preload.src = getResourceUrl(app.steam_drid_db_data.img_hero);
            preloadImages.push(preload);
        }
    }
    return preloadImages;
});

export function useHomeVM() {
    appsStripped.value = Library.getAll("last_launch").slice(0, 9);

    return { preloadContainer, currentId, appsStripped, appIsSelected, appIsGame, controllerHints }
}

Library.watch(useHomeVM)
