<script setup lang="ts">
import { Settings } from '../../../models/settings';
import { scale } from '../../../services/utils/stylingHelper';
import { currentDir, places } from '../../../view_models/modals/fileSelectionModalViewModel';
import OpticalStorageIcon from '../../../assets/svg/storage_optical.svg';
import DriveStorageIcon from '../../../assets/svg/hard_drive.svg';
import FolderIcon from '../../../assets/svg/meta_folder.svg';
</script>

<template>
    <div v-focus-section:places class="quick-places">
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.home">
            <FolderIcon class="icon" />
            <h2>Home</h2>
        </div>
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.desktop">
            <FolderIcon class="icon" />
            <h2>Desktop</h2>
        </div>
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.documents">
            <FolderIcon class="icon" />
            <h2>Documents</h2>
        </div>
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.download">
            <FolderIcon class="icon" />
            <h2>Download</h2>
        </div>
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.music">
            <FolderIcon class="icon" />
            <h2>Music</h2>
        </div>
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.pictures">
            <FolderIcon class="icon" />
            <h2>Pictures</h2>
        </div>
        <div v-focus class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="currentDir = places.videos">
            <FolderIcon class="icon" />
            <h2>Videos</h2>
        </div>

        <div v-for="volume in places.volumes" v-focus class="item sfx-nav-handler sfx-activation-handler"
            @sn:enter-down="currentDir = volume.mount_point">
            <OpticalStorageIcon v-if="volume.is_removable" class="icon" />
            <DriveStorageIcon v-if="!volume.is_removable" class="icon" />
            <h2>{{ volume.name }}</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.quick-places {
    height: 100%;
    width: 30%;

    border-right: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px 0 0 7px;

    & .item {
        width: 100%;
        height: v-bind(scale(45));

        display: flex;
        align-items: center;
        gap: v-bind(scale(10));

        box-sizing: border-box;
        padding-left: v-bind(scale(20));

        & .icon {
            width: v-bind(scale(30));
            height: v-bind(scale(30));
            color: white;
        }

        &:focus {
            background-color: v-bind('Settings.get("accent_color")');
        }
    }
}
</style>