<script setup lang="ts">
import CategoryList from '../components/library/CategoryList.vue';
import { Settings } from '../models/settings';
import { contentHeight, solidBgColor } from '../utils/styles';


</script>

<template>
    <div class="page">
        <div class="solid-bg"></div>
        <div class="page-content">
            <div class="left-part">
                <CategoryList/>
            </div>
        </div>
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

    border-right: 1px solid v-bind('Settings.get("accent_color") + "40"');
}
</style>