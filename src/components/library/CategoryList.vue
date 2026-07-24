<script setup lang="ts">
import { useLibraryVM } from '../../view_models/libraryViewModel';
import GamepadIcon from '../../assets/svg/category_games.svg';
import AppsIcon from '../../assets/svg/category_apps.svg';
import AddIcon from '../../assets/svg/plus.svg';
import { scale, scaleH, scaleW } from '../../services/utils/stylingHelper';
import { Settings } from '../../models/settings';
import { ref } from 'vue';
import FileSelectionModal from '../modals/FileSelectionModal/FileSelectionModal.vue';
import { tryAddGameFromLnk } from '../../services/import/fromLnk.ts';
import { useExplorerModal } from '../../view_models/modals/fileSelectionModalViewModel.ts';

const { categories, currentCategory, currentCategoryIndex, categoriesLengths } = useLibraryVM();

const showFileSelection = ref(false);

const select = (index: number) => {
    currentCategoryIndex.value = index;
}

const importAppFromFile = (filePath: string) => {
    if (filePath.endsWith('.lnk')) tryAddGameFromLnk(filePath).catch((err) => console.error(err));
}

const selectFile = async () => {
    importAppFromFile(await useExplorerModal(showFileSelection, () => showFileSelection.value = false))
}
</script>

<template>
    <div v-focus-section:cat-list="{ enterTo: 'last-focused' }" class="container">
        <div v-for="(category, index) in categories" v-focus @sn:enter-down="select(index)"
            class="list-element sfx-nav-handler sfx-activation-handler"
            :class="{ active: currentCategory === category }">
            <div class="first-item">
                <GamepadIcon v-if="category === 'Games'" class="icon" />
                <AppsIcon v-if="category === 'Applications'" class="icon" />
                <h2>{{ category }}</h2>
            </div>

            <h2 class="second-item gray">{{ categoriesLengths[index] }}</h2>
        </div>

        <div v-focus @sn:enter-down="selectFile"
            class="add-btn list-element sfx-nav-handler sfx-activation-handler">
            <div class="first-item">
                <AddIcon class="icon" />
                <h2>Add from file</h2>
            </div>

            <div class="second-item"></div>
        </div>
    </div>

    <Transition name="modal">
        <FileSelectionModal v-if="showFileSelection" />
    </Transition>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
}

.list-element {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: v-bind(scaleH(55));

    box-sizing: border-box;
    padding: 0 v-bind(scaleW(55));

    transition: all .1s ease;

    & .first-item {
        display: flex;
        align-items: center;
        gap: v-bind(scaleW(40));
    }

    & .icon {
        width: v-bind(scale(30));
        height: v-bind(scale(30));
        color: white;
    }
}

.list-element.active {
    background-color: #2A282D;
    box-shadow: 0px 0 4px 3px #2A282D;
}

.list-element:focus {
    background-color: v-bind('Settings.get("accent_color")');
    box-shadow: 0px 0 4px 3px v-bind('Settings.get("accent_color")');

    & .second-item {
        color: white;
    }
}

.add-btn {
    border-top: 1px solid v-bind('Settings.get("accent_color") + "40"');
}
</style>