<script setup lang="ts">
import { inject } from 'vue';
import { Settings } from '../../../models/settings';
import { btnColor, scale } from '../../../services/utils/stylingHelper';

const controlledValue = defineModel<number>();
const props = defineProps<{
    title: string,
    showPercentage: boolean,
}>();

const onSliderMoved = (event: any) => {
    if (event.detail.direction == "left") {
        event.preventDefault();
        controlledValue.value = Math.max(controlledValue.value - 0.02, 0);
    } else if (event.detail.direction == "right") {
        event.preventDefault();
        controlledValue.value = Math.min(controlledValue.value + 0.02, 1);
    }
}
</script>

<template>
    <div class="container">
        <h2>{{ title }}</h2>

        <div class="main-content">
            <slot></slot>

            <span class="slider">
                <span class="progress"></span>
                <span v-focus @sn:willmove="onSliderMoved" class="pipka sfx-nav-handler"></span>
            </span>

            <h2 v-if="showPercentage" class="percentage">{{ (controlledValue * 100).toFixed(0) }}%</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: v-bind(scale(20));
}

.main-content {
    display: flex;
    align-items: center;
    gap: v-bind(scale(30));

    & .slider {
        width: v-bind(scale(870));
        height: v-bind(scale(10));
        border-radius: 7px;
        background-color: white;
        position: relative;

        & .progress {
            position: absolute;
            inset: 0;
            width: calc(v-bind(controlledValue) * 100%);

            border-radius: 7px;
            background-color: v-bind('Settings.get("accent_color")');
        }

        & .pipka {
            aspect-ratio: 1;
            width: v-bind(scale(25));

            background-color: v-bind(btnColor);
            border-radius: 100%;
            border: v-bind(scale(5)) solid white;

            box-sizing: border-box;
            position: absolute;
            top: 50%;
            left: calc(v-bind(controlledValue) * 100%);
            transform: translateX(-50%) translateY(-50%);

            &:focus {
                border-color: v-bind('Settings.get("accent_color")');
            }
        }
    }
}
</style>

<style lang="scss">
.settings-slider-icon {
    aspect-ratio: 1;
    width: v-bind(scale(30));
    color: white;
}
</style>