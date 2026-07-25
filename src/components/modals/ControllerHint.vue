<script setup lang="ts">
import XboxButtonA from '../../assets/svg/xbox_button_a.svg';
import XboxButtonB from '../../assets/svg/xbox_button_b.svg';
import XboxButtonX from '../../assets/svg/xbox_button_x.svg';
import XboxButtonY from '../../assets/svg/xbox_button_y.svg';
import { ControllerButton } from '../../services/gamepad';
import { scaleH, scaleW, solidBgColor } from '../../services/utils/stylingHelper';

const props = defineProps<{
    hints: {
        buttonType: ControllerButton,
        label: string
    }[]
}>();
</script>

<template>
    <div class="hint-container">
        <div v-for="hint in hints" class="hint-item">
            <XboxButtonA v-if="hint.buttonType === 'a'" class="icon" />
            <XboxButtonB v-if="hint.buttonType === 'b'" class="icon" />
            <XboxButtonX v-if="hint.buttonType === 'x'" class="icon" />
            <XboxButtonY v-if="hint.buttonType === 'y'" class="icon" />
            <h3>{{ hint.label }}</h3>
        </div>
    </div>
</template>

<style scoped lang="scss">
.hint-container {
    height: v-bind(scaleH(40));
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: v-bind(scaleW(20));

    box-sizing: border-box;
    padding: 0 v-bind(scaleW(20));

    background-color: v-bind(solidBgColor);
    border-radius: 7px 7px 0 0;

    & .hint-item {
        display: flex;
        align-items: center;
        text-align: center;
        gap: v-bind(scaleW(5));
    }
}
</style>