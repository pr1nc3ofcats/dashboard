<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Settings } from '../../models/settings';
import { scale } from '../../services/stylingHelper';
import { invoke } from '@tauri-apps/api/core';

const freeSpaceMb = ref(0);
const allSpaceMb = ref(0);
const takenSpaceMb = computed(() => allSpaceMb.value - freeSpaceMb.value);
const spaceTakenPercentage = computed(() => ((takenSpaceMb.value / allSpaceMb.value) * 100).toFixed(2) + '%');

onMounted(async () => {
    try {
        freeSpaceMb.value = await invoke('get_free_space', { directory: Settings.get('main_storage_directory') });
        allSpaceMb.value = await invoke('get_all_space', { directory: Settings.get('main_storage_directory') });
    } catch (err) {
        console.log(err);
    }
});
</script>

<template>
    <div class="container">
        <h2 class="title">
            <span class="bold">{{ Settings.get('main_storage_directory') }}</span><br>
            {{ `${freeSpaceMb < 1024 ? freeSpaceMb.toFixed(1) : (freeSpaceMb / 1024).toFixed(1)} ${freeSpaceMb < 1024
                ? 'Mb' : 'Gb'} / ${allSpaceMb < 1024 ? allSpaceMb.toFixed(1) : (allSpaceMb / 1024).toFixed(1)}
                ${allSpaceMb < 1024 ? 'Mb' : 'Gb'} available` }} </h2>

                <div class="indicator">
                    <h2 class="title">{{ spaceTakenPercentage }}</h2>
                    <div class="bar-outer">
                        <div class="bar-inner"></div>
                    </div>
                </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;

    box-sizing: border-box;
    padding: 0 v-bind(scale(55));
    padding-bottom: v-bind(scale(60));

    display: flex;
    flex-direction: column;
    gap: v-bind(scale(35));
}

.indicator {
    width: 100%;

    & h2 {
        width: 100%;
        text-align: center;
        margin-bottom: v-bind(scale(10));
    }

    & .bar-outer {
        width: 100%;
        height: v-bind(scale(10));
        position: relative;

        background-color: white;
        border-radius: 7px;

        & .bar-inner {
            position: absolute;
            top: 0;
            bottom: 0;

            width: v-bind(spaceTakenPercentage);

            background-color: v-bind('Settings.get("accent_color")');
            border-radius: 7px;
        }
    }
}
</style>