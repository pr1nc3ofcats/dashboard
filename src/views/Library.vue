<script setup lang="ts">
import ControllerHint from '../components/ControllerHint.vue';
import AppGrid from '../components/library/AppGrid.vue';
import CategoryList from '../components/library/CategoryList.vue';
import { Settings } from '../models/settings.ts';
import { contentHeight, solidBgColor } from '../services/stylingHelper.ts';
import { useLibraryVM } from '../view_models/libraryViewModel.ts';

const { appIsGame, appIsSelected } = useLibraryVM()
const settings = Settings.getData();
</script>

<template>
    <div class="page">
        <div class="solid-bg"></div>
        <div class="page-content">
            <div class="left-part">
                <CategoryList />
            </div>
            <div class="right-part">
                <AppGrid />
            </div>
        </div>
        <ControllerHint :is-game="appIsGame" :should-show="appIsSelected" />
    </div>
</template>

<style scoped lang="scss">
.solid-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: v-bind(solidBgColor);

    z-index: -98;
}

.page-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: v-bind(contentHeight);

    display: flex;
}

.left-part {
    width: 23vw;
    height: 100%;

    border-right: 1px solid v-bind('settings.accent_color + "40"');
}

.right-part {
    width: 100%;
    height: 100%;
}
</style>