<script setup lang="ts">
import { btnColor, scale } from '../../../services/utils/stylingHelper';

const props = defineProps<{
    label: string,
    title: string,
    callback: () => void
}>();
</script>

<template>
    <div class="container">
        <h2>{{ label }}:</h2>

        <div v-focus @sn:enter-down="callback()"
            class="button focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler">
            <h2>
                {{ title }}
            </h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    gap: v-bind(scale(20));
}

.button {
    width: v-bind(scale(200));
    height: v-bind(scale(50));
    background-color: v-bind(btnColor);
    border-radius: 7px;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>