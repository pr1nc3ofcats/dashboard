<script setup lang="ts">
import Backgorund from '../components/home/Backgorund.vue';
import { scale, scaleH, scaleW } from '../utils/styles.ts';
import { Library } from "../models/library";
import { getFileUrl } from "../utils/fileLoader";
import { computedAsync } from "@vueuse/core";
import { currentId } from './homeViewModel.ts';

const currentLogo = computedAsync(async () => {
    const logo = Library.get(currentId.value, "logo");
    return logo ? await getFileUrl(logo!) : ''
}, '');
const nextId = () => {
    if (currentId.value >= 8) {
        currentId.value = 0;
    } else {
        currentId.value++;
    }
}
</script>

<template>
    <Backgorund />
    <div class="content-container">
        <div class="logo-container">
            <Transition name="logo-fade">
                <img :key="currentLogo" :src="currentLogo" class="logo" @click="nextId">
            </Transition>
        </div>

        <div class="ribbon">

        </div>
    </div>
</template>

<style scoped>
.content-container {
    margin-top: v-bind(scaleH(50));
    margin-bottom: v-bind(scaleH(75));
    margin-left: v-bind(scaleW(100));
    margin-right: v-bind(scaleW(100));

    & .logo-container {
        position: relative;

        & .logo {
            position: absolute;
            max-height: 20vh;
            max-width: 25vw;
        }
    }

    & .ribbon {
        position: fixed;
        bottom: v-bind(scaleH(75));
        width: calc(100% - v-bind(scaleW(200)));
    }
}

.logo-fade-enter-active,
.logo-fade-leave-active {
    transition: opacity .2s ease, transform .2s ease;
}

.logo-fade-enter-from {
    opacity: 0;
    transform: translateY(v-bind(scale(40)));
}

.logo-fade-leave-to {
    opacity: 0;
}
</style>