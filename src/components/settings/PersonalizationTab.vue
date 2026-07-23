<script setup lang="ts">
import { ref } from 'vue';
import { Settings } from '../../models/settings';
import PropertyList from './components/PropertyList.vue';
import { scale } from '../../services/utils/stylingHelper.ts';

const scrollClip = ref(null);
const accentColor = ref(Settings.get('accent_color'));
</script>

<template>
    <div v-focus-section:tab-content class="scroll-clip" ref="scrollClip">
        <div class="container">
            <PropertyList :title="'Accent color'"
                :values="['#C48A61', '#C46161', '#75C461', '#61C4BC', '#6178C4', '#7361C4', '#C261C4']"
                :displayValues="['Orange', 'Red', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink']"
                :source="accentColor",
                :callback="(selected: string) => Settings.set('accent_color', selected)" class="item" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.scroll-clip {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
    scrollbar-width: none;

    box-sizing: border-box;
    padding: v-bind(scale(10)) v-bind(scale(40));
}
</style>