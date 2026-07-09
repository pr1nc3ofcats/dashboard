<script setup lang="ts">
import { convertFileSrc } from '@tauri-apps/api/core';
import { scale, scaleH, scaleW } from '../../utils/styles.ts';
import { appsStripped, currentId, useHomeVM } from '../../views/homeViewModel.ts';
import { Settings } from '../../models/settings.ts';
import { inject, onMounted } from 'vue';

useHomeVM();

const select = (id: number) => {
    currentId.value = id;
}
const leaveSection = (event: any) => {
    if (event.detail.nextSectionId !== "ribbon") currentId.value = -1
}

onMounted(() => {
    const spatialNavigation: any = inject('spatialNavigation');
    spatialNavigation.focus("ribbon");
})
</script>

<template>
    <div v-focus-section:ribbon class="ribbon">
        <div v-for="app in appsStripped" v-focus
            v-focus-events="{ focused: () => select(app.id), unfocused: leaveSection }" class="tile"
            :class="{ active: app.id === currentId }">
            <img :src="convertFileSrc(app.imgSquare)" class="tile-image">
            <h2>{{ app.title }}</h2>
        </div>

        <div v-for="_ in (9 - appsStripped.length)" class="tile"></div>
    </div>
</template>

<style scoped>
.ribbon {
    position: fixed;
    bottom: v-bind(scaleH(75));
    left: v-bind(scaleH(100));
    width: calc(100% - v-bind(scaleW(200)));

    display: flex;
    justify-content: space-between;
    align-items: end;
}

.tile {
    position: relative;
    width: v-bind(scale(160));
    height: v-bind(scale(160));
    border-radius: 7px;

    transition: width .1s ease, height .1s ease;

    & .tile-image {
        width: 100%;
        height: 100%;
        object-fit: cover;

        border-radius: 7px;
    }

    & h2 {
        overflow-wrap: break-word;

        position: absolute;
        bottom: 0;
        width: 100%;

        box-sizing: border-box;
        padding: v-bind(scale(2)) v-bind(scale(10));
        border-radius: 0 0 7px 7px;
        background-color: rgba(0, 0, 0, 0.8);

        opacity: 0;
    }
}

.tile.active {
    width: v-bind(scale(160 * 1.5));
    height: v-bind(scale(160 * 1.5));

    & h2 {
        opacity: 1;
    }
}

.tile.active::after {
    content: "";
    position: absolute;
    inset: v-bind(scale(-6));
    border: v-bind(scale(3)) solid #C48A61;
    border-radius: calc(7px + v-bind(scale(6)));
    box-shadow: 0 0 v-bind(scale(4)) v-bind(scale(4)) v-bind('Settings.get("accent_color") + "40"');
    pointer-events: none;
}
</style>