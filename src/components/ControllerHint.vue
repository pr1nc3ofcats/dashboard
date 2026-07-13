<script setup lang="ts">
import XboxButtonA from '../assets/svg/xbox_button_a.svg';
import XboxButtonB from '../assets/svg/xbox_button_b.svg';
import XboxButtonX from '../assets/svg/xbox_button_x.svg';
import XboxButtonY from '../assets/svg/xbox_button_y.svg';
import { scaleH, scaleW, solidBgColor } from '../services/stylingHelper';

defineProps({
    isGame: Boolean,
    shouldShow: Boolean,
});
</script>

<template>
    <div class="hint-container" :class="{show: shouldShow}">
        <div class="hint-item">
            <XboxButtonA class="icon"/>
            <h3>{{ isGame ? 'Play' : 'Launch' }}</h3>
        </div>
        <div class="hint-item">
            <XboxButtonY class="icon"/>
            <h3>Details</h3>
        </div>
    </div>
</template>

<style scoped lang="scss">
.hint-container {
    width: 13vw;
    height: v-bind(scaleH(40));
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    justify-content: space-between;
    
    box-sizing: border-box;
    padding: 0 v-bind(scaleW(20));

    background-color: v-bind(solidBgColor);
    border-radius: 7px 7px 0 0;

    opacity: 0;
    transition: opacity 0.1s ease;

    & .hint-item {
        display: flex;
        align-items: center;
        text-align: center;
        gap: v-bind(scaleW(5));
    }
}

.hint-container.show {
    opacity: 1;
}
</style>