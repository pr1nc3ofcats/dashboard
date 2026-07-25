<script setup lang="ts">
import { inject, onMounted, useId } from 'vue';
import { btnColor, scale } from '../../../services/utils/stylingHelper';

const spatialNavigation: any = inject('spatialNavigation');

const controlledValue = defineModel<string>();
const props = defineProps<{
    title: string,
}>();

const inputId = `text-input-field-${useId()}`;

onMounted(() => (document.getElementById(inputId) as any).innerText = controlledValue.value)
</script>

<template>
    <div class="container">
        <h2>{{ title }}:</h2>

        <div contenteditable="true" @keydown.delete="(e) => e.stopPropagation()" @keydown.up="spatialNavigation.resume()"
            @keydown.down="spatialNavigation.resume()" v-focus @sn:unfocused="(e) => controlledValue = e.target.innerText"
            @sn:focused="spatialNavigation.pause()" type="text" :id="inputId" class="input focusable-br7 sfx-nav-handler"></div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    gap: v-bind(scale(20));

    & .input {
        display: flex;
        align-items: center;
        justify-content: center;

        min-width: v-bind(scale(200));
        min-height: v-bind(scale(50));

        box-sizing: border-box;
        padding: v-bind(scale(5)) v-bind(scale(20));

        background-color: v-bind(btnColor);

        margin-block-start: 0;
        margin-block-end: 0;
        font-family: 'SST', sans-serif;
        font-weight: 300;
        color: white;
        font-size: v-bind(scale(24));

        border: none;
        border-radius: 7px;
    }
}
</style>