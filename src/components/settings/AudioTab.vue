<script setup lang="ts">
import { computed, inject, onMounted, ref, useId, watch } from 'vue';
import { Settings } from '../../models/settings';
import DropDown from './components/DropDown.vue';
import { computedAsync } from '@vueuse/core';
import { basename, join, resourceDir } from '@tauri-apps/api/path';
import { selectOptionFromFile } from '../../view_models/settingsViewModel.ts';
import Slider from './components/Slider.vue';
import SpeakerIcon from '../../assets/svg/volume_2.svg';

const spatialNavigation: any = inject('spatialNavigation');
const tabSectionId = `tab-content-${useId()}`;

const bgMusicOption = ref(Settings.get('background_music'));
const bgMusicOptionPretty = computedAsync(async () => await basename(bgMusicOption.value), '')
Settings.watch('background_music', (newValue) => bgMusicOption.value = newValue)

const sfxVolumeOption = ref(Settings.get('sfx_volume'));
watch(sfxVolumeOption, (v) => Settings.set('sfx_volume', v));
const bgMusiVolumeOption = ref(Settings.get('background_music_volume'));
watch(bgMusiVolumeOption, (v) => Settings.set('background_music_volume', v));

const builtInMusicPaths = computedAsync(async () => {
    let result = new Map<string, string>();
    const resourcesDir = await resourceDir();

    result.set('The Night Swim.wav', await join(resourcesDir, 'music', 'The Night Swim.wav'));
    result.set('HOME - Resonance.wav', await join(resourcesDir, 'music', 'HOME - Resonance.wav'));
    return result;
})

onMounted(() => {
    spatialNavigation.setDefaultSection(tabSectionId)
})
</script>

<template>
    <div v-focus-section:[tabSectionId] class="tab-content-container" @keydown.delete="() => spatialNavigation.focus('tab-list')">
        <DropDown :title="'Background music'" :values="['The Night Swim.wav', 'HOME - Resonance.wav', 'file']"
            :displayValues="['Raulinho - The Night Swim', 'HOME - Resonance', 'From file...']"
            :source="bgMusicOptionPretty" :callback="async (selected: string) => {
                if (selected === 'file') {
                    selectOptionFromFile('background_music');
                } else if (builtInMusicPaths.has(selected)) {
                    Settings.set('background_music', builtInMusicPaths.get(selected));
                }
            }" class="item" />

        <Slider v-model="sfxVolumeOption" :showPercentage="true" :title="'Sfx volume'">
            <SpeakerIcon class="settings-slider-icon" />
        </Slider>

        <Slider v-model="bgMusiVolumeOption" :showPercentage="true" :title="'Music volume'">
            <SpeakerIcon class="settings-slider-icon" />
        </Slider>
    </div>
</template>