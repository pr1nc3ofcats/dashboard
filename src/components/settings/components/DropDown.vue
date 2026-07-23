<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { btnColor, scale } from '../../../services/utils/stylingHelper';
import { Settings } from '../../../models/settings';

const spatialNavigation: any = inject('spatialNavigation');

const props = defineProps<{
    title: string,
    values: string[],
    displayValues: string[],
    source: string,
    callback: (selected: string) => void,
}>();

const mappedDisplayValues = computed(() => {
    let result = new Map<string, string>();
    for (let [i, v] of props.values.entries()) {
        result.set(v, props.displayValues.at(i))
    }
    return result
})

const expanded = ref(false);

const select = (value: string) => {
    props.callback(value);
    expanded.value = false;
    spatialNavigation.focus('tab-content');
}

const expand = () => {
    expanded.value = true;
}

const tryCollapse = (event) => {
    if (event.detail.nextSectionId !== "dropdown-options") expanded.value = false;
};
</script>

<template>
    <div class="container">
        <h2>{{ title }}:</h2>

        <div class="dropdown-menu">
            <div v-focus @sn:enter-down="expand"
                class="current-value-box focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler">
                <h2>{{ mappedDisplayValues.get(source) }}</h2>
            </div>

            <div v-focus-section:dropdown-options class="other-options-box" :class="{ expanded }">
                <div v-for="value in values.filter((v) => v !== source)" v-focus @sn:enter-down="select(value)"
                    @sn:unfocused="tryCollapse" class="item sfx-nav-handler sfx-activation-handler">
                    <h2>{{ mappedDisplayValues.get(value) }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    gap: v-bind(scale(20));
}

.dropdown-menu {
    position: relative;
}

.current-value-box {
    min-width: v-bind(scale(200));
    min-height: v-bind(scale(50));
    background-color: v-bind(btnColor);
    border-radius: 7px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.other-options-box {
    position: absolute;
    top: calc(100% + v-bind(scale(20)));

    min-width: v-bind(scale(200));

    display: none;
    opacity: 0;
    transition: opacity 0.2s ease;

    & .item {
        min-height: v-bind(scale(50));
        background-color: v-bind(btnColor);

        display: flex;
        justify-content: center;
        align-items: center;

        &:focus {
            background-color: v-bind('Settings.get("accent_color")');
        }

        &:first-child {
            border-radius: 7px 7px 0 0;
        }

        &:last-child {
            border-radius: 0 0 7px 7px;
        }
    }

    &.expanded {
        opacity: 1;
        display: block;
    }
}
</style>