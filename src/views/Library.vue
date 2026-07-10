<script setup lang="ts">
import { solidBgColor } from '../utils/styles';


</script>

<template>
    <div class="page">
        <div class="solid-bg"></div>
        <div class="page-content"></div>
    </div>
</template>

<style scoped lang="scss">
.solid-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: v-bind(solidBgColor);

    z-index: -98;
}

.page-content {
    width: 400px;
    height: 400px;
    background-color: aqua;
}
</style>