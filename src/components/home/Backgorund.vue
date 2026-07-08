<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getFileUrl } from '../../utils/fileLoader';
import { Settings } from '../../models/settings';
import { currentId } from '../../views/homeViewModel';
import { computedAsync } from '@vueuse/core';
import { Library } from '../../models/library';

const wallapper = ref('');

const currentBg = computedAsync(async () => {
    const bg = Library.get(currentId.value, "steamDetails")?.imgBackground;
    return bg ? await getFileUrl(bg!) : wallapper.value
}, wallapper.value);

onMounted(async () => {
    try {
        wallapper.value = await getFileUrl(Settings.get("wallapper"));
    } catch (err) {
        console.error(err);
    }
})
</script>

<template>
    <Transition name="bg-fade">
        <img :key="currentBg" :src="currentBg" class="background-image">
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

.bg-fade-enter-active {
    transition: opacity .2s ease;
}
.bg-fade-leave-active {
    transition: opacity .6s ease;
}

.bg-fade-enter-from {
    opacity: 0;
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