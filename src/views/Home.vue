<script setup lang="ts">
import Backgorund from '../components/home/Backgorund.vue';
import Ribbon from '../components/home/Ribbon.vue';
</script>

<template>
    <Backgorund />
    <!-- <div class="content-container">
        <div class="logo-container">
            <Transition name="logo-fade">
                <img :key="currentLogo" :src="currentLogo" class="logo">
            </Transition>
        </div>
    </div> -->
    <Ribbon/>
</template>

<style scoped>
/* .content-container {
    margin-top: v-bind(scaleH(50));
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