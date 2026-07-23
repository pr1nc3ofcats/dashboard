<script setup lang="ts">
import { Settings } from '../../models/settings';
import { scale, scaleH, scaleW } from '../../services/utils/stylingHelper';
import { currentTab, tabs, TabType } from '../../view_models/settingsViewModel';

const select = (tab: TabType) => {
    currentTab.value = tab;
}
</script>

<template>
    <div v-focus-section:tab-list="{ enterTo: 'last-focused' }" class="container">
        <div v-for="tab in tabs" v-focus @sn:enter-down="select(tab)"
            class="list-element sfx-nav-handler sfx-activation-handler" :class="{ active: currentTab === tab }">
            <h2>{{ tab }}</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
}

.list-element {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: v-bind(scaleH(55));

    box-sizing: border-box;
    padding: 0 v-bind(scaleW(55));

    transition: all .1s ease;
}

.list-element.active {
    background-color: #2A282D;
    box-shadow: 0px 0 4px 3px #2A282D;
}

.list-element:focus {
    background-color: v-bind('Settings.get("accent_color")');
    box-shadow: 0px 0 4px 3px v-bind('Settings.get("accent_color")');
}
</style>