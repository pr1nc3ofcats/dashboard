<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { scale, updateResolution } from './utils/styles';
import TopBar from './components/TopBar.vue';

onMounted(() => {
  window.addEventListener('resize', updateResolution);
});
</script>

<template>
  <TopBar />
  <RouterView />
</template>

<style lang="scss">
body {
  margin: 0 0;
}

h1,
h2,
h3,
p {
  margin: 0 0;
  margin-block-start: 0;
  margin-block-end: 0;
  padding: 0 0;
  font-family: 'SST', sans-serif;
  font-weight: 300;
  color: white;
}

h1 {
  font-size: v-bind(scale(40));
}

h2 {
  font-size: v-bind(scale(24));
}

h3,
p {
  font-size: v-bind(scale(20));
}
</style>