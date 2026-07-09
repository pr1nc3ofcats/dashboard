import { computed, Ref, ref } from "vue";
import { Library } from "../models/library";
import { Application } from "../models/application";
import { convertFileSrc } from "@tauri-apps/api/core";

export const currentId = ref(-1);
export const appsStripped: Ref<Application[], Application[]> = ref([]);
export const appIsSelected = computed(() => {
    return Library.get(currentId.value) ? true : false;
});
export const appIsGame = computed(() => {
    let app = Library.get(currentId.value);
    return app ? app.isGame : false;
});

export function useHomeVM() {
    appsStripped.value = Library.getAll("last_launch").slice(0, 9);
    // currentId.value = appsStripped.value.at(0)?.id ?? -1;
}
