<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { Settings } from '../../models/settings';
import DropDown from './components/DropDown.vue';

const spatialNavigation: any = inject('spatialNavigation');

const accentColorOption = ref(Settings.get('accent_color'));

onMounted(() => {
    spatialNavigation.focus('tab-content')
})
</script>

<template>
    <div v-focus-section:tab-content class="container">
        <DropDown :title="'Accent color'"
            :values="['#C48A61', '#C46161', '#75C461', '#61C4BC', '#6178C4', '#7361C4', '#C261C4']"
            :displayValues="['Orange', 'Red', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink']" :source="accentColorOption" ,
            :callback="(selected: string) => {
                Settings.set('accent_color', selected);
                accentColorOption = Settings.get('accent_color')
            }" class="item" />
    </div>
</template>

<style scoped lang="scss"></style>