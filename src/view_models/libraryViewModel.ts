import { computed, ref, Ref } from "vue";
import { Library } from "../models/library.ts";

const categories: Ref<string[], string[]> = ref([]);
const currentCategoryIndex = ref(0);
const currentCategory = computed(() => categories.value[currentCategoryIndex.value]);
const currentGridView = computed(() => Library.getAllFromCategory(currentCategory.value, "last_launch"));

const categoriesLengths = computed(() => categories.value.map((value) => Library.getAllFromCategory(value, "last_launch").length));

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

    return { currentAppId, categories, currentCategoryIndex, currentCategory, categoriesLengths, currentGridView, appIsSelected, appIsGame };
}

Library.watch(useLibraryVM)