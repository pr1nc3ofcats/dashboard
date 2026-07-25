<script setup lang="ts">
import { computed, inject, onMounted, ref, useId, watch } from 'vue';
import { Settings } from '../../models/settings';
import DropDown from './components/DropDown.vue';
import { computedAsync } from '@vueuse/core';
import { basename, join, resourceDir } from '@tauri-apps/api/path';
import { selectOptionFromFs } from '../../view_models/settingsViewModel.ts';
import Slider from './components/Slider.vue';
import SpeakerIcon from '../../assets/svg/volume_2.svg';
import { invoke } from '@tauri-apps/api/core';

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
    try {
        let result = new Map<string, string>();
        const musicDir = await join(await resourceDir(), 'music');
        const entries = await invoke<DirEntry[]>('get_dir_entries', { directory: musicDir });

        for (let e of entries) {
            if (e.name.endsWith('.mp3')) result.set(e.name, await join(musicDir, e.name));
        }

        return result;
    } catch (err) {
        console.error(err);
    }
}, new Map())
const builtInMusicDropDownValues = computed(() => Array.from(builtInMusicPaths.value.keys()).concat(['file']))
const builtInMusicDropDownDisplayValues = computed(() => Array.from(builtInMusicPaths.value.keys()).map((file) => file.split('.')[0]).concat(['From file...']))

onMounted(() => {
    spatialNavigation.setDefaultSection(tabSectionId)
})
</script>

<template>
    <div v-focus-section:[tabSectionId] class="tab-content-container"
        @keydown.delete="() => spatialNavigation.focus('tab-list')">
        <DropDown :title="'Background music'" :values="builtInMusicDropDownValues"
            :displayValues="builtInMusicDropDownDisplayValues" :source="bgMusicOptionPretty" :callback="(selected: string) => {
                if (selected === 'file') {
                    selectOptionFromFs('background_music');
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