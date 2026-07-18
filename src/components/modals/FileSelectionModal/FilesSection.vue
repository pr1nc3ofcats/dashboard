<script setup lang="ts">
import path from 'path-browserify';
import { currentDir, currentDirEntries, currentEntrySelected, directoryGoUp, dirEntriesSorted, sortingMode } from '../../../view_models/modals/fileSelectionModalViewModel';
import ArrowUpIcon from '../../../assets/svg/triangle_up.svg';
import ArrowDownIcon from '../../../assets/svg/triangle_down.svg';
import FolderIcon from '../../../assets/svg/meta_folder.svg';
import FileIcon from '../../../assets/svg/meta_file.svg';
import { inject, ref, watch } from 'vue';
import { scrollContainerIntoView } from '../../../services/utils/scrollingHelper';
import dayjs from 'dayjs';
import { Settings } from '../../../models/settings';
import { scale } from '../../../services/utils/stylingHelper';

const spatialNavigation: any = inject('spatialNavigation');
const filesScrollClip = ref(null);

watch(currentDirEntries, () => spatialNavigation.focus('entries-list'))

const displaySizePretty = (bytes: number) => {
    const KB = 1024
    const MB = KB * 1024
    const GB = MB * 1024

    if (bytes < KB) return `${bytes} B`
    if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`
    if (bytes < GB) return `${(bytes / MB).toFixed(1)} MB`
    return `${(bytes / GB).toFixed(1)} GB`
}
</script>

<template>
    <div class="files" @keydown.delete="directoryGoUp">
        <div class="sorting-bar">
            <div v-focus @sn:enter-down="() => sortingMode = sortingMode == 'a-z' ? 'z-a' : 'a-z'"
                class="group sfx-nav-handler sfx-activation-handler">
                <h2>Name</h2>
                <ArrowUpIcon v-if="sortingMode == 'a-z'" class="icon" />
                <ArrowDownIcon v-if="sortingMode == 'z-a'" class="icon" />
            </div>
            <div v-focus
                @sn:enter-down="() => sortingMode = sortingMode == 'firstModified' ? 'lastModified' : 'firstModified'"
                class="group  sfx-nav-handler sfx-activation-handler">
                <h2>Modified</h2>
                <ArrowUpIcon v-if="sortingMode == 'firstModified'" class="icon" />
                <ArrowDownIcon v-if="sortingMode == 'lastModified'" class="icon" />
            </div>
            <div v-focus @sn:enter-down="() => sortingMode = sortingMode == 'smallest' ? 'biggest' : 'smallest'"
                class="group  sfx-nav-handler sfx-activation-handler">
                <h2>Size</h2>
                <ArrowUpIcon v-if="sortingMode == 'smallest'" class="icon" />
                <ArrowDownIcon v-if="sortingMode == 'biggest'" class="icon" />
            </div>
        </div>

        <div class="scroll-container" ref="filesScrollClip">
            <!-- Idk how to achieve desired focus behaivour with this lib -->
            <div v-focus-section:entries-list="{
                enterTo: 'default-element',
                defaultElement: '#entries-focus-section .item:first-child'
            }" class="item-container" id="entries-focus-section">
                <div v-for="(entry, index) in dirEntriesSorted" v-focus
                    class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="() => {
                        if (entry.is_dir) currentDir = path.join(currentDir, entry.name)
                        else {
                            currentEntrySelected = index;
                            spatialNavigation.focus('#select-btn');
                        }
                    }" @sn:focused="(e) => scrollContainerIntoView(e, filesScrollClip, 1)"
                    :class="{ selected: currentEntrySelected == index }">

                    <div class="section">
                        <FolderIcon v-if="entry.is_dir" class="icon" />
                        <FileIcon v-if="!entry.is_dir" class="icon" />
                        <h2>{{ entry.name }}</h2>
                    </div>
                    <div class="section">
                        <h2>{{ dayjs(entry.modified).format('DD.MM.YYYY') }}</h2>
                    </div>
                    <div class="section">
                        <h2>{{ entry.is_dir ? '' : displaySizePretty(entry.size) }}</h2>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.icon {
    min-width: v-bind(scale(30));
    min-height: v-bind(scale(30));
    width: v-bind(scale(30));
    height: v-bind(scale(30));
    color: white;
}

.files {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    & .sorting-bar {
        height: v-bind(scale(45));
        display: flex;
        align-items: center;
        flex-shrink: 0;

        & .group {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: v-bind(scale(5));

            flex: 1;
            height: 100%;

            background-color: #38373A;

            & .icon {
                padding-left: v-bind(scale(5));
            }

            &:focus {
                background-color: v-bind('Settings.get("accent_color")');
            }

            &:last-child {
                border-radius: 0 7px 0 0;
            }
        }
    }

    & .scroll-container {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    & .item-container {
        width: 100%;

        & .item {
            width: 100%;
            min-height: v-bind(scale(45));
            display: flex;
            align-items: center;

            & .section {
                height: 100%;
                flex: 1;
                display: flex;
                align-items: center;
                gap: v-bind(scale(10));

                box-sizing: border-box;
                padding-left: v-bind(scale(20));

                word-break: break-all;
            }

            &:focus {
                background-color: v-bind('Settings.get("accent_color")');
            }

            &.selected {
                background-color: #38373A;
            }
        }
    }
}
</style>