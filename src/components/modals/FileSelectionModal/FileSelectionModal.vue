<script setup lang="ts">
import { scale, solidBgColor } from '../../../services/utils/stylingHelper';
import { inject, onMounted, onUnmounted, ref } from 'vue';
import path from 'path-browserify';
import { currentDir, currentEntrySelected, dirEntriesSorted } from '../../../view_models/modals/fileSelectionModalViewModel';
import TopBar from './TopBar.vue';
import QuickPlaces from './QuickPlaces.vue';
import FilesSection from './FilesSection.vue';

const emit = defineEmits(['modal-close']);

const spatialNavigation: any = inject('spatialNavigation');
const rootElement = ref(null);

onMounted(() => {
    spatialNavigation.focus("modal-frame");
    spatialNavigation.set({
        navigableFilter: (el) => rootElement.value?.contains(el) ?? false // restrict focus escape
    });
})

onUnmounted(() => {
    spatialNavigation.set({ navigableFilter: null });
    spatialNavigation.focus();
}) // release focus

const props = defineProps<{
    callback: (file: string) => void
}>()
</script>

<template>
    <div v-focus-section:modal-frame="{ defaultElement: '#cancel-btn' }"
        class="container" ref="rootElement">
        <div class="overlay"></div>

        <div class="frame">
            <TopBar />

            <div class="main-content-container">
                <QuickPlaces />

                <FilesSection />
            </div>

            <div class="buttons-container">
                <div v-focus
                    @sn:enter-down="() => { callback(path.join(currentDir, dirEntriesSorted[currentEntrySelected].name)); emit('modal-close'); }"
                    @sn:unfocused="currentEntrySelected = null" id="select-btn"
                    class="button focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler">
                    <h2>
                        Select
                    </h2>
                </div>
                <div v-focus @sn:enter-down="emit('modal-close')" id="cancel-btn"
                    class="button focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler">
                    <h2>
                        Cancel
                    </h2>
                </div>
            </div>
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
    width: 80%;
    aspect-ratio: 16 / 9;
    background-color: v-bind(solidBgColor);
    border-radius: 7px;

    box-sizing: border-box;
    padding: v-bind(scale(20));

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
}

.main-content-container {
    width: 100%;
    height: 100%;
    display: flex;

    flex: 1;

    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;
}

.buttons-container {
    height: v-bind(scale(70));
    width: 100%;

    display: flex;
    justify-content: end;
    align-items: end;
    gap: v-bind(scale(25));

    flex-shrink: 0;

    & .button {
        width: v-bind(scale(200));
        height: v-bind(scale(50));
        background-color: #38373A;
        border-radius: 7px;

        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>