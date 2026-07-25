<script setup lang="ts">
import { inject, useId, onMounted, ref, watch } from 'vue';
import DropDown from './components/DropDown.vue';
import { Settings } from '../../models/settings.ts';
import TextInput from './components/TextInput.vue';
import Button from './components/Button.vue';
import { selectOptionFromFs } from '../../view_models/settingsViewModel.ts';

const spatialNavigation: any = inject('spatialNavigation');
const tabSectionId = `tab-content-${useId()}`;

const languageOption = ref(Settings.get('language'));
Settings.watch('language', (newValue) => languageOption.value = newValue)
const countryCodeOption = ref(Settings.get('country_code'));
Settings.watch('country_code', (newValue) => countryCodeOption.value = newValue)

const sgdbApiOption = ref(Settings.get('sgdb_api_key'));
watch(sgdbApiOption, (newValue) => Settings.set('sgdb_api_key', newValue));

const mainStorageDirOption = ref(Settings.get('main_storage_directory'));
Settings.watch('main_storage_directory', (newValue) => mainStorageDirOption.value = newValue)

onMounted(() => {
    spatialNavigation.setDefaultSection(tabSectionId)
})
</script>

<template>
    <div v-focus-section:[tabSectionId] class="tab-content-container"
        @keydown.delete="() => spatialNavigation.focus('tab-list')">
        <Button :label="'Main storage directory (for free space widget)'" :title="mainStorageDirOption"
            :callback="() => selectOptionFromFs('main_storage_directory')" />

        <TextInput v-model="sgdbApiOption" :title="'SGDB api key'" />

        <DropDown :title="'Language (preferred in game metadata)'" :values="['english', 'russian']"
            :displayValues="['English', 'Russian']" :source="languageOption"
            :callback="(selected: string) => Settings.set('language', selected)" class="item" />

        <DropDown :title="'Country code'" :values="['en', 'ru']" :displayValues="['en', 'ru']"
            :source="countryCodeOption" :callback="(selected: string) => Settings.set('country_code', selected)"
            class="item" />
    </div>
</template>

<style scoped lang="scss"></style>