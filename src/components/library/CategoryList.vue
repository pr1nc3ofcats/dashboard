<script setup lang="ts">
import { useLibraryVM } from '../../view_models/libraryViewModel';
import GamepadIcon from '../../assets/svg/category_games.svg';
import AppsIcon from '../../assets/svg/category_apps.svg';
import { scale, scaleH, scaleW } from '../../modules/stylingHelper';
import { Settings } from '../../models/settings';
import { inject } from 'vue';
import { useAudioManager } from '../../modules/audioManager';

const { categories, currentCategory, currentCategoryIndex, categoriesLengths } = useLibraryVM();
const spatialNavigation: any = inject('spatialNavigation');
const settings = Settings.getData();
const { sfxNav } = useAudioManager();

const select = (index: number) => {
    currentCategoryIndex.value = index;
}
</script>

<template>
    <div v-focus-section:cat-list="{ enterTo: 'last-focused' }" class="container">
        <div v-for="(category, index) in categories" v-focus @sn:focused="() => {sfxNav.play(); select(index);}"
            @sn:enter-down="() => spatialNavigation.move('right')" class="list-element"
            :class="{ active: currentCategory === category }">
            <div class="first-item">
                <GamepadIcon v-if="category === 'Games'" class="icon" />
                <AppsIcon v-if="category === 'Applications'" class="icon" />
                <h2>{{ category }}</h2>
            </div>

            <h2 class="second-item">{{ categoriesLengths[index] }}</h2>
        </div>
    </div>
</template>

<style scoped>
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

    & .second-item {
        color: #717171;
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
    background-color: v-bind('settings.accent_color');
    box-shadow: 0px 0 4px 3px v-bind('settings.accent_color');

    & .second-item {
        color: white;
    }
}
</style>