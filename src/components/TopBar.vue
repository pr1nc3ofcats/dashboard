<script setup lang="ts">
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Settings } from '../services/settings';
import { performPulse, scale, scaleH, scaleW } from '../modules/stylingHelper';
import { RouterLink } from 'vue-router';
import HomeIcon from '../assets/svg/home.svg';
import SettingsIcon from '../assets/svg/settings.svg';
import LibraryIcon from '../assets/svg/library.svg';
import dayjs from 'dayjs'
import { useAudioManager } from '../modules/audioManager';

const { sfxNav } = useAudioManager();
const settings = Settings.getData();
const pfpImgUrl = ref('');
const userName = ref('');
const time = ref('');
const date = ref('');
let interval: number;

const updateDateTime = () => {
    const now = dayjs()
    time.value = now.format('HH:mm')
    date.value = now.format('DD.MM.YYYY')
}
onMounted(() => {
    updateDateTime()
    interval = setInterval(updateDateTime, 1000)
})
onBeforeUnmount(() => {
    clearInterval(interval)
})

onMounted(async () => {
    try {
        pfpImgUrl.value = convertFileSrc(settings.avatar_image);
        userName.value = await invoke('get_user_name');
    } catch (err) {
        console.error(err);
    }
})
</script>

<template>
    <div id="top-bar">
        <div v-focus-section class="user-profile-container">
            <div v-focus @sn:focused="() => sfxNav.play()" @sn:enter-down="performPulse" class="avatar-wrapper focusable-circle"><img :src="pfpImgUrl"
                    class="avatar"></div>
            <h3>{{ userName }}</h3>
        </div>

        <div class="categories-container">
            <RouterLink to="/" , exactActiveClass="active" class="category-item">
                <HomeIcon class="icon" />
            </RouterLink>
            <RouterLink to="/library" , exactActiveClass="active" class="category-item">
                <LibraryIcon class="icon" />
            </RouterLink>
            <RouterLink to="/settings" , exactActiveClass="active" class="category-item">
                <SettingsIcon class="icon" />
            </RouterLink>
        </div>

        <div class="clock-container">
            <h3>{{ time }}</h3>
            <h3>{{ date }}</h3>
        </div>
    </div>
</template>

<style scoped lang="scss">
#top-bar {
    margin-top: v-bind(scaleH(75));
    margin-left: v-bind(scaleW(100));
    margin-right: v-bind(scaleW(100));

    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;
}

.user-profile-container {
    display: flex;
    align-items: center;
    gap: v-bind(scaleW(15));

    & .avatar {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        object-fit: cover;
    }

    & .avatar-wrapper {
        width: v-bind(scale(60));
        height: v-bind(scale(60));
    }
}

.categories-container {
    display: flex;
    gap: v-bind(scaleW(15));

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    & .category-item {
        background-color: rgba(0, 0, 0, 0.4);
        width: v-bind(scale(60));
        height: v-bind(scale(60));
        border-radius: 100%;
        box-sizing: border-box;
        padding: v-bind(scale(15));
        aspect-ratio: 1 / 1;

        transition: all 0.1s linear;

        & .icon {
            color: white;
        }
    }

    & .category-item.active {
        background-color: rgba(255, 255, 255, 0.4);

        & .icon {
            color: black;
        }
    }
}

.clock-container {
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>