<script setup lang="ts">
import { computed, inject, onMounted, ref, useId } from 'vue';
import { Settings } from '../../models/settings';
import DropDown from './components/DropDown.vue';
import { computedAsync } from '@vueuse/core';
import { basename } from '@tauri-apps/api/path';
import { selectOptionFromFs } from '../../view_models/settingsViewModel.ts';

const spatialNavigation: any = inject('spatialNavigation');
const tabSectionId = `tab-content-${useId()}`;

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
    spatialNavigation.setDefaultSection(tabSectionId)
})
</script>

<template>
    <div v-focus-section:[tabSectionId] class="tab-content-container" @keydown.delete="() => spatialNavigation.focus('tab-list')">
        <DropDown :title="'Accent color'"
            :values="['#C48A61', '#C46161', '#75C461', '#61C4BC', '#6178C4', '#7361C4', '#C261C4']"
            :displayValues="['Orange', 'Red', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink']" :source="accentColorOption" ,
            :callback="(selected: string) => Settings.set('accent_color', selected)" class="item" />

        <DropDown :title="'Wallpaper'" :values="['default', 'file']"
            :displayValues="['Neon Rain Orange', 'From file...']" :source="wallapperOptionPretty" :callback="(selected: string) => {
                if (selected === 'default') {
                    Settings.set('wallapper', defaultWallpaper)
                } else {
                    selectOptionFromFs('wallapper');
                }
            }" class="item" />

        <DropDown :title="'Avatar'" :values="['default', 'file']"
            :displayValues="['Default', 'From file...']" :source="avatarOptionPretty" :callback="async (selected: string) => {
                if (selected === 'default') {
                    Settings.set('avatar_image', defaultAvatar)
                } else {
                    selectOptionFromFs('avatar_image');
                }
            }" class="item" />
    </div>
</template>
