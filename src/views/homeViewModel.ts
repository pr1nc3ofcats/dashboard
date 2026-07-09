import { Ref, ref } from "vue";
import { Library } from "../models/library";
import { Application } from "../models/application";
import { convertFileSrc } from "@tauri-apps/api/core";

export const currentId = ref(-1);
export const appsStripped: Ref<Application[], Application[]> = ref([]);

export function useHomeVM() {
    appsStripped.value = Library.getAll("last_launch").slice(0, 9);
    currentId.value = appsStripped.value.at(0)?.id ?? -1;

    for (let app of appsStripped.value) {
        if (app.steamDetails?.imgBackground) {
            let preload = new Image();
            preload.src = convertFileSrc(app.steamDetails.imgBackground);
        }
    }
}
