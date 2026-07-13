<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { scale } from './services/stylingHelper.ts';
import TopBar from './components/TopBar.vue';
import { Settings } from './models/settings.ts';
import Backgorund from './components/Backgorund.vue';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { execOnAfterAppMount, execOnAppSetup, execOnBeforeAppMount, execOnWindowFocus, execOnWindowUnfocus } from './services/dependencyInjector.ts';
import './services/gamepad.ts';

const settings = Settings.getData();

execOnAppSetup();
onBeforeMount(execOnBeforeAppMount);
onMounted(async () => {
  execOnAfterAppMount();

  await getCurrentWindow().onFocusChanged(({ payload }) => {
    if (payload) {
      execOnWindowFocus();
    } else {
      execOnWindowUnfocus();
    }
  });
});
</script>

<template>
  <Backgorund />
  <TopBar />

  <RouterView v-slot="{ Component, route }">
    <Transition name="page">
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </RouterView>
</template>

<style lang="scss">
@use "./styles/pages-transition.scss";
@use "./styles/pulse.scss";

body {
  margin: 0 0;
  overflow: hidden;
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

*:focus {
  outline: none;
}

.focusable-br7 {
  position: relative;

  &:focus::after {
    content: "";
    position: absolute;
    inset: v-bind(scale(-6));
    border: v-bind(scale(3)) solid v-bind('settings.accent_color');
    border-radius: calc(7px + v-bind(scale(6)));
    box-shadow: 0 0 v-bind(scale(4)) v-bind(scale(4)) v-bind('settings.accent_color + "40"');
    pointer-events: none;
  }
}

.focusable-circle {
  position: relative;

  &:focus::after {
    content: "";
    position: absolute;
    inset: v-bind(scale(-6));
    border: v-bind(scale(3)) solid v-bind('settings.accent_color');
    border-radius: 100%;
    box-shadow: 0 0 v-bind(scale(4)) v-bind(scale(4)) v-bind('settings.accent_color + "40"'); /* 40 = 25% */
    pointer-events: none;
  }
}
</style>