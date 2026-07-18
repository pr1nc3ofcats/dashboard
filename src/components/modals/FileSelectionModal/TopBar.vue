<script setup lang="ts">
import { scale } from '../../../services/utils/stylingHelper';
import { currentDir, currentDirTidy, directoryGoUp } from '../../../view_models/modals/fileSelectionModalViewModel';
import BackIcon from '../../../assets/svg/arrow_left_curved.svg';
import ForwardIcon from '../../../assets/svg/arrow_right_curved.svg';
import UpIcon from '../../../assets/svg/double_arrow_up.svg';
import path from 'path-browserify';
</script>

<template>
    <div v-focus-section:top-bar class="top-bar">
        <!-- <div class="group">
            <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                <BackIcon class="icon" />
            </div>
            <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                <ForwardIcon class="icon" />
            </div>
        </div> -->
        <div class="group">
            <div v-focus @sn:enter-down="directoryGoUp" class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                <UpIcon class="icon" />
            </div>
            <h1 v-html="currentDirTidy"></h1>
        </div>
    </div>
</template>

<style scoped lang="scss">
.icon-holder {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;
}

.icon {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;

    box-sizing: border-box;
    padding: v-bind(scale(2));
}

.top-bar {
    display: flex;
    align-items: center;
    margin-bottom: v-bind(scale(10));
    gap: v-bind(scale(50));

    flex-shrink: 0;

    height: v-bind(scale(65));

    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;

    padding: 0 v-bind(scale(40));

    & .group {
        display: flex;
        align-items: center;
        gap: v-bind(scale(25));
    }
}
</style>