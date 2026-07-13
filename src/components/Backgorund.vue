<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Settings } from '../models/settings';
import { useHomeVM } from '../view_models/homeViewModel';
import { Library } from '../models/library';
import { convertFileSrc } from '@tauri-apps/api/core';
import { solidBgColor } from '../services/stylingHelper';

const { currentId } = useHomeVM();
const settings = Settings.getData();

const wallapper = ref('');

const currentBg = computed(() => {
    const bg = Library.get(currentId.value)?.steamDetails?.imgBackground;
    return bg ? convertFileSrc(bg!) : wallapper.value
});

onMounted(() => {
    wallapper.value = convertFileSrc(settings.wallapper);
})
</script>

<template>
    <div class="solid-bg"></div>
    <Transition name="bg-fade">
        <img :key="currentBg" :src="currentBg"
            @error="($event.currentTarget as HTMLImageElement).style.display = 'none'" class="background-image">
    </Transition>
    <div class="overlay"></div>
</template>

<style scoped lang="scss">
.background-image {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    object-fit: cover;

    z-index: -100;
}

.solid-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: v-bind(solidBgColor);

    z-index: -101;
}

.bg-fade-enter-active {
    transition: all 0.2s ease;
}

.bg-fade-leave-active {
    transition: opacity 4s ease-in-out;
}

.bg-fade-enter-from {
    opacity: 0;
    transform: scale(1.1);
    transform-origin: center center;
}

.bg-fade-leave-to {
    opacity: 0;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;

    background: linear-gradient(to bottom,
            black 0%,
            transparent 30%,
            transparent 70%,
            black 100%);
    z-index: -99;
    opacity: 90%;
}
</style>