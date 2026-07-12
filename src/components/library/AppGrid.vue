<script setup lang="ts">
import { convertFileSrc } from '@tauri-apps/api/core';
import { performPulse, scale } from '../../modules/stylingHelper';
import { useLibraryVM } from '../../view_models/libraryViewModel';
import { inject, onMounted } from 'vue';

const { currentGridView, currentAppId } = useLibraryVM();

const select = (id: number) => {
    currentAppId.value = id;
}
const leaveSection = (event: any) => {
    if (event.detail.nextSectionId !== "app-grid") currentAppId.value = -1
}

onMounted(() => {
    const spatialNavigation: any = inject('spatialNavigation');
    spatialNavigation.focus("app-grid");
})
</script>

<template>
    <div v-focus-section:app-grid class="container">
        <div v-for="app in currentGridView" v-focus @sn:focused="() => select(app.id)" @sn:unfocused="leaveSection"
            @sn:enter-down="performPulse" class="tile focusable-br7">
            <img :src="convertFileSrc(app.imgSquare)" class="tile-image">
            <h2>{{ app.title }}</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    margin: 0 v-bind(scale(75));
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: v-bind(scale(15));
}

.tile {
    aspect-ratio: 1;
    min-height: 0;
    position: relative;
    border-radius: 7px;

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

        transition: opacity .1s ease;

        opacity: 0;
    }
}

.tile:focus {
    & h2 {
        opacity: 1;
    }
}
</style>