<script setup lang="ts">
import ControllerHint from '../components/ControllerHint.vue';
import Ribbon from '../components/home/Ribbon.vue';
import { appIsGame, appIsSelected } from './homeViewModel.ts';
</script>

<template>
    <!-- <div class="content-container">
        <div class="logo-container">
            <Transition name="logo-fade">
                <img :key="currentLogo" :src="currentLogo" class="logo">
            </Transition>
        </div>
    </div> -->

    <div class="page">
        <Ribbon/>
        <ControllerHint :is-game="appIsGame" :should-show="appIsSelected" />
    </div>
</template>

<style scoped>
/* .content-container {
    & .logo-container {
        position: relative;

        & .logo {
            position: absolute;
            max-height: 20vh;
            max-width: 25vw;
        }
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
} */
</style>