<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { grabFocus, releaseFocus } from '../../services/utils/modalHelper';
import { scale, solidBgColor } from '../../services/utils/stylingHelper';
import { items, resolveSgdbModal, selectedImage } from '../../view_models/modals/sgdbViewModel';
import { scrollContainerIntoView } from '../../services/utils/scrollingHelper';
import { SgdbImage } from '../../services/api/steamGridDb';

const spatialNavigation: any = inject('spatialNavigation');
const rootElement = ref(null);
const scrollClip = ref(null);

const closeModal = (item: SgdbImage) => {
    setTimeout(() => resolveSgdbModal(item), 500);
}

onMounted(() => grabFocus(rootElement, spatialNavigation));

onUnmounted(() => releaseFocus(spatialNavigation));
</script>

<template>
    <div v-focus-section:modal-frame class="container" ref="rootElement">
        <div class="overlay"></div>

        <div class="frame" ref="scrollClip">
            <h1>Choose background image</h1>

            <div v-for="item in items" class="item">
                <div v-focus class="img-holder focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler"
                    @sn:focused="(e) => scrollContainerIntoView(e, scrollClip, 100)" @sn:enter-down="() => closeModal(item)">
                    <img :src="item.url">
                </div>
                <h2>{{ item.width }}x{{ item.height }}</h2>
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
    width: 75%;
    aspect-ratio: 16 / 9;
    background-color: v-bind(solidBgColor);
    border-radius: 7px;

    box-sizing: border-box;
    padding: v-bind(scale(30));

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: v-bind(scale(15));

    & h1 {
        margin-bottom: v-bind(scale(15));
    }
}

.item {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: v-bind(scale(15));

    & .img-holder {
        aspect-ratio: 16 / 9;
        width: 80%;
    }

    & img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        border-radius: 7px;
    }
}
</style>