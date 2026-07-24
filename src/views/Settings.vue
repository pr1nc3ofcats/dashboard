<script setup lang="ts">
import { ref } from 'vue';
import PersonalizationTab from '../components/settings/PersonalizationTab.vue';
import TabList from '../components/settings/TabList.vue';
import { Settings } from '../models/settings';
import { contentHeight, scale, solidBgColor } from '../services/utils/stylingHelper';
import { currentTab, shouldShowExplorer } from '../view_models/settingsViewModel.ts';
import FileSelectionModal from '../components/modals/FileSelectionModal/FileSelectionModal.vue';
import AudioTab from '../components/settings/AudioTab.vue';

const scrollClip = ref(null);
</script>

<template>
    <div class="page">
        <div class="solid-bg"></div>

        <div class="page-content">
            <div class="left-part">
                <TabList />
            </div>
            <div class="right-part" ref="scrollClip">
                <PersonalizationTab v-if="currentTab === 'Personalization'" />
                <AudioTab v-if="currentTab === 'Audio'" />
            </div>
        </div>

        <FileSelectionModal v-if="shouldShowExplorer"/>
    </div>
</template>

<style scoped lang="scss">
.solid-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: v-bind(solidBgColor);

    z-index: -98;
}

.page-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: v-bind(contentHeight);

    display: flex;
}

.left-part {
    width: 23vw;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    border-right: 1px solid v-bind('Settings.get("accent_color") + "40"');
}

.right-part {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: v-bind(scale(10)) v-bind(scale(40));

    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
}
</style>

<style lang="scss">
.tab-content-container {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: v-bind(scale(20));
}
</style>