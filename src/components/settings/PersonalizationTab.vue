<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { Settings } from '../../models/settings';
import DropDown from './components/DropDown.vue';
import { scale } from '../../services/utils/stylingHelper.ts';
import { computedAsync } from '@vueuse/core';
import { basename } from '@tauri-apps/api/path';

const spatialNavigation: any = inject('spatialNavigation');

const accentColorOption = ref(Settings.get('accent_color'));
Settings.watch('accent_color', (newValue) => accentColorOption.value = newValue)

const wallapperOption = ref(Settings.get('wallapper'));
const wallapperOptionPretty = computedAsync(async () => await basename(wallapperOption.value), '')
Settings.watch('wallapper', (newValue) => wallapperOption.value = newValue)

const avatarOption = ref(Settings.get('avatar_image'));
const avatarOptionPretty = computedAsync(async () => await basename(avatarOption.value), '')
Settings.watch('avatar_image', (newValue) => avatarOption.value = newValue)

const defaultWallpaper = computedAsync(async () => await Settings.getDefault('wallapper'), '');
const defaultAvatar = computedAsync(async () => await Settings.getDefault('avatar_image'), '');

onMounted(() => {
    spatialNavigation.focus('tab-content')
})
</script>

<template>
    <div v-focus-section:tab-content class="tab-content-container">
        <DropDown :title="'Accent color'"
            :values="['#C48A61', '#C46161', '#75C461', '#61C4BC', '#6178C4', '#7361C4', '#C261C4']"
            :displayValues="['Orange', 'Red', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink']" :source="accentColorOption" ,
            :callback="(selected: string) => Settings.set('accent_color', selected)" class="item" />

        <DropDown :title="'Wallpaper'" :values="['default.webp', 'file']"
            :displayValues="['Neon Rain Orange', 'From file...']" :source="wallapperOptionPretty" :callback="async (selected: string) => {
                if (selected === 'default.webp') {
                    Settings.set('wallapper', defaultWallpaper)
                }
            }" class="item" />

        <DropDown :title="'Avatar'" :values="['default-avatar.webp', 'file']"
            :displayValues="['Default', 'From file...']" :source="avatarOptionPretty" :callback="async (selected: string) => {
                if (selected === 'default-avatar.webp') {
                    Settings.set('wallapper', defaultAvatar)
                }
            }" class="item" />
    </div>
</template>

<style scoped lang="scss">
.tab-content-container {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: v-bind(scale(20));
}
</style>