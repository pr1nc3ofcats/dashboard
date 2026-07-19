<script setup lang="ts">
import { convertFileSrc } from '@tauri-apps/api/core';
import { scale } from '../../services/utils/stylingHelper';
import { useLibraryVM } from '../../view_models/libraryViewModel';
import { inject, onMounted, ref } from 'vue';
import { Library } from '../../models/library';
import { scrollContainerIntoView } from '../../services/utils/scrollingHelper';

const { currentGridView, currentAppId } = useLibraryVM();
const scrollClip = ref(null);
const extraScroll = Number(scale(130).replace('px', ''));

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
    <div class="scroll-clip" ref="scrollClip">
        <div v-focus-section:app-grid class="container">
            <div v-for="app in currentGridView" v-focus @sn:focused="(e) => { select(app.id); scrollContainerIntoView(e, scrollClip, extraScroll) }"
                @sn:unfocused="leaveSection" @sn:enter-down="Library.tryLaunch(app.id)"
                class="tile focusable-br7 pulse-handler sfx-nav-handler sfx-activation-handler">
                <img :src="convertFileSrc(app.img_square)" class="tile-image">
                <!-- <h2>{{ app.title }}</h2> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.scroll-clip {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;

    padding: v-bind(scale(10));
    margin: v-bind(scale(-10));

    scrollbar-width: none;
}

.container {
    margin: 0 v-bind(scale(75));
    margin-bottom: v-bind(scale(130));
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: v-bind(scale(15));

    position: relative;
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