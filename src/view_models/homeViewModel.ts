import { computed, Ref, ref } from "vue";
import { Library } from "../models/library";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Application } from "../models/application";

const currentId = ref(-1);
const appsStripped: Ref<Application[], Application[]> = ref([]);
const appIsSelected = computed(() => {
    return Library.get(currentId.value) ? true : false;
});
const appIsGame = computed(() => {
    let app = Library.get(currentId.value);
    return app ? app.categories.includes("Games") : false;
});

const preloadContainer = computed(() => {
    let preloadImages = [];
    for (let app of appsStripped.value) {
        if (app.steamDetails?.imgBackground) {
            let preload = new Image();
            preload.src = convertFileSrc(app.steamDetails.imgBackground);
            preloadImages.push(preload);
        }
    }
    return preloadImages;
});

export function useHomeVM() {
    appsStripped.value = Library.getAll("last_launch").slice(0, 9);

    return { currentId, appsStripped, appIsSelected, appIsGame }
}

Library.watch(useHomeVM)
