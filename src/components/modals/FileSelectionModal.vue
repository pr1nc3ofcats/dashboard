<script setup lang="ts">
import { scale, solidBgColor } from '../../services/stylingHelper';
import BackIcon from '../../assets/svg/arrow_left_curved.svg';
import ForwardIcon from '../../assets/svg/arrow_right_curved.svg';
import UpIcon from '../../assets/svg/arrow_up.svg';
import ArrowUpIcon from '../../assets/svg/triangle_up.svg';
import ArrowDownIcon from '../../assets/svg/triangle_down.svg'
import { ref } from 'vue';

const sortingMode = ref<"a-z" | "z-a" | "lastModified" | "firstModified" | "biggest" | "smallest">("a-z");

</script>

<template>
    <div class="container">
        <div class="overlay"></div>

        <div class="frame">
            <div v-focus-section class="top-bar">
                <div class="group">
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <BackIcon class="icon" />
                    </div>
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <ForwardIcon class="icon" />
                    </div>
                </div>
                <div class="group">
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <UpIcon class="icon" />
                    </div>
                    <h1>Path text</h1>
                </div>
            </div>

            <div class="sorting-bar">
                <div class="group">
                    <h2>Name</h2>
                    <ArrowUpIcon v-if="sortingMode == 'a-z'" class="icon" />
                    <ArrowDownIcon v-if="sortingMode == 'z-a'" class="icon" />
                </div>
                <div class="group">
                    <h2>Modified</h2>
                    <ArrowUpIcon v-if="sortingMode == 'firstModified'" class="icon" />
                    <ArrowDownIcon v-if="sortingMode == 'lastModified'" class="icon" />
                </div>
                <div class="group">
                    <h2>Size</h2>
                    <ArrowUpIcon v-if="sortingMode == 'smallest'" class="icon" />
                    <ArrowDownIcon v-if="sortingMode == 'biggest'" class="icon" />
                </div>
            </div>

            <div class="items-container"></div>
            <div class="buttons-container"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    z-index: 1000;
}

.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.frame {
    width: 75%;
    aspect-ratio: 16 / 9;
    background-color: v-bind(solidBgColor);
    border-radius: 7px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.icon-holder {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;
}

.icon {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;
}

.top-bar {
    display: flex;
    align-items: center;
    margin-left: v-bind(scale(40));
    gap: v-bind(scale(50));

    height: v-bind(scale(65));

    & .group {
        display: flex;
        align-items: center;
        gap: v-bind(scale(25));
    }
}

.sorting-bar {
    height: v-bind(scale(45));
}
</style>