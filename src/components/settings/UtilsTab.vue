<script setup lang="ts">
import { inject, useId, onMounted, ref } from 'vue';
import DropDown from './components/DropDown.vue';
import { Settings } from '../../models/settings.ts';

const spatialNavigation: any = inject('spatialNavigation');
const tabSectionId = `tab-content-${useId()}`;

const languageOption = ref(Settings.get('language'));
Settings.watch('language', (newValue) => languageOption.value = newValue)
const countryCodeOption = ref(Settings.get('country_code'));
Settings.watch('country_code', (newValue) => countryCodeOption.value = newValue)

onMounted(() => {
    spatialNavigation.setDefaultSection(tabSectionId)
})
</script>

<template>
    <div v-focus-section:[tabSectionId] class="tab-content-container"
        @keydown.delete="() => spatialNavigation.focus('tab-list')">
        <DropDown :title="'Language (preferred in game metadata)'" :values="['english', 'russian']"
            :displayValues="['English', 'Russian']" :source="languageOption"
            :callback="(selected: string) => Settings.set('language', selected)" class="item" />

        <DropDown :title="'Country code'" :values="['en', 'ru']"
            :displayValues="['en', 'ru']" :source="countryCodeOption"
            :callback="(selected: string) => Settings.set('country_code', selected)" class="item" />
    </div>
</template>

<style scoped lang="scss"></style>