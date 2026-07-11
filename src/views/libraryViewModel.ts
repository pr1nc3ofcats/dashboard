import { computed, ref, Ref } from "vue";
import { Library } from "../models/library.ts";

const categories: Ref<string[], string[]> = ref([]);
const currentCategoryIndex = ref(0);
const currentGridView = computed(() => Library.getAllFromCategory(categories.value[currentCategoryIndex.value], "last_launch"));

const currentAppId = ref(-1);
const appIsSelected = computed(() => {
    return Library.get(currentAppId.value) ? true : false;
});
const appIsGame = computed(() => {
    let app = Library.get(currentAppId.value);
    return app ? app.categories.includes("Games") : false;
});

export function useLibraryVM() {
    categories.value = Library.getAllCategories();

    return { categories, currentCategoryIndex, currentGridView, appIsSelected, appIsGame };
}