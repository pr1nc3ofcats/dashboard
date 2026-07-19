<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { scale } from './services/utils/stylingHelper.ts';
import TopBar from './components/modals/TopBar.vue';
import { Settings } from './models/settings.ts';
import Backgorund from './components/Backgorund.vue';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { execOnAfterAppMount, execOnBeforeAppMount, execOnWindowFocus, execOnWindowUnfocus } from './services/utils/dependencyInjector.ts';
import './services/gamepad.ts';
import { invoke } from '@tauri-apps/api/core';
import { onDomUpdatedHook } from './services/utils/globalHooks.ts';
import { fetchSteamDetailsByName } from './services/api/steamDetails.ts';
import { getHeroesBySteamAppId, getSquareGridsBySteamAppId } from './services/api/steamGridDb.ts';
import { getHltbBySteamAppId, toHowLongToBeat } from './services/api/howLongToBeat.ts';

const observer = new MutationObserver(onDomUpdatedHook);

observer.observe(document.getElementById('app'), {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

onBeforeMount(execOnBeforeAppMount);

onMounted(async () => {
  setTimeout(() => invoke('show_window'), 3000);

  execOnAfterAppMount();

  await getCurrentWindow().onFocusChanged(({ payload }) => {
    if (payload) {
      execOnWindowFocus();
    } else {
      execOnWindowUnfocus();
    }
  });

  // Testing it
  //console.log(await fetchSteamDetailsByName("nine sols", "ru", "russian"))
  // 1809540 Nine sols
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
@use "./styles/base.scss";
@use "./styles/modal-transition.scss";

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

.focusable-br7 {
  position: relative;

  &:focus::after {
    content: "";
    position: absolute;
    inset: v-bind(scale(-6));
    border: v-bind(scale(3)) solid v-bind('Settings.get("accent_color")');
    border-radius: calc(7px + v-bind(scale(6)));
    box-shadow: 0 0 v-bind(scale(4)) v-bind(scale(4)) v-bind('Settings.get("accent_color") + "40"');
    pointer-events: none;
  }
}

.focusable-circle {
  position: relative;

  &:focus::after {
    content: "";
    position: absolute;
    inset: v-bind(scale(-6));
    border: v-bind(scale(3)) solid v-bind('Settings.get("accent_color")');
    border-radius: 100%;
    box-shadow: 0 0 v-bind(scale(4)) v-bind(scale(4)) v-bind('Settings.get("accent_color") + "40"');
    /* 40 = 25% */
    pointer-events: none;
  }
}
</style>