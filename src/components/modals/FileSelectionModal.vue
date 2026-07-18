<script setup lang="ts">
import { scale, solidBgColor } from '../../services/utils/stylingHelper';
import BackIcon from '../../assets/svg/arrow_left_curved.svg';
import ForwardIcon from '../../assets/svg/arrow_right_curved.svg';
import UpIcon from '../../assets/svg/double_arrow_up.svg';
import ArrowUpIcon from '../../assets/svg/triangle_up.svg';
import ArrowDownIcon from '../../assets/svg/triangle_down.svg';
import FolderIcon from '../../assets/svg/meta_folder.svg';
import FileIcon from '../../assets/svg/meta_file.svg';
import OpticalStorageIcon from '../../assets/svg/storage_optical.svg';
import DriveStorageIcon from '../../assets/svg/hard_drive.svg';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { Settings } from '../../models/settings';
import { invoke } from '@tauri-apps/api/core';
import { computedAsync } from '@vueuse/core';
import dayjs from 'dayjs';
import { scrollContainerIntoView } from '../../services/utils/scrollingHelper';

type SortingMode = "a-z" | "z-a" | "lastModified" | "firstModified" | "biggest" | "smallest";
const sortEntries = (mode: SortingMode, target: DirEntry[]) => {
    const compare = (a: DirEntry, b: DirEntry): number => {
        // folders always on top
        if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1

        // fucking thing never stores numbers
        if (mode === "lastModified") return new Date(b.modified).getTime() - new Date(a.modified).getTime()
        else if (mode === "firstModified") return new Date(a.modified).getTime() - new Date(b.modified).getTime()

        else if (mode === "a-z") return a.name.localeCompare(b.name)
        else if (mode === "z-a") return b.name.localeCompare(a.name)
        else if (mode === "biggest") return b.size - a.size
        else if (mode === "smallest") return a.size - b.size
        return 0
    }

    return target.toSorted(compare)
}
const displaySizePretty = (bytes: number) => {
    const KB = 1024
    const MB = KB * 1024
    const GB = MB * 1024

    if (bytes < KB) return `${bytes} B`
    if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`
    if (bytes < GB) return `${(bytes / MB).toFixed(1)} MB`
    return `${(bytes / GB).toFixed(1)} GB`
}

const emit = defineEmits(['modal-close']);

const spatialNavigation: any = inject('spatialNavigation');
const rootElement = ref(null);
const filesScrollClip = ref(null);

const sortingMode = ref<SortingMode>("a-z");

// Path must always be normalized and absolute
const currentDir = ref(Settings.get('main_storage_directory'));
const currentDirTidy = computed(() => {
    const pathEntries = currentDir.value.split('/').filter(Boolean);
    for (let i = pathEntries.length; i >= 1; i--) {
        const joined = pathEntries.slice(-i).join(' > ');
        if (joined.length <= 60) return joined.replaceAll(' > ', '<span class="gray"> > </span>');
    }
    return pathEntries.pop();
})

const currentDirEntries = computedAsync(async () => {
    try {
        let result = await invoke<DirEntry[]>('get_dir_entries', { directory: currentDir.value + "/" });
        return result;
    } catch (err) {
        console.error(err)
    }
}, []);
const dirEntriesSorted = computed(() => sortEntries(sortingMode.value, currentDirEntries.value));
/*   /\
     |   */
const currentEntrySelected = ref<number>();

const places = computedAsync(async () => {
    let result = await invoke<Places>('get_fs_places');
    result.volumes.map((v) => {
        if (!v.name) {
            v.name = v.mount_point;
        }
        return v;
    });
    return result;
});

onMounted(() => {
    spatialNavigation.focus("modal-frame");
    spatialNavigation.set({
        navigableFilter: (el) => rootElement.value?.contains(el) ?? false // restrict focus escape
    });
})

onUnmounted(() => { spatialNavigation.set({ navigableFilter: null }); spatialNavigation.focus() }) // release focus

const props = defineProps<{
    callback: (file: string) => void
}>()
</script>

<template>
    <div v-focus-section:modal-frame="{ defaultElement: '#cancel-btn' }" @keydown.delete="emit('modal-close')"
        class="container" ref="rootElement">
        <div class="overlay"></div>

        <div class="frame">
            <div class="top-bar">
                <div class="group">
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <BackIcon class="icon" />
                    </div>
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <ForwardIcon class="icon" />
                    </div>
                </div>
                <div class="group">
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <UpIcon class="icon" />
                    </div>
                    <h1 v-html="currentDirTidy"></h1>
                </div>
            </div>

            <div class="main-content-container">
                <div v-focus-section:places class="quick-places">
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.home">
                        <FolderIcon class="icon" />
                        <h2>Home</h2>
                    </div>
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.desktop">
                        <FolderIcon class="icon" />
                        <h2>Desktop</h2>
                    </div>
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.documents">
                        <FolderIcon class="icon" />
                        <h2>Documents</h2>
                    </div>
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.download">
                        <FolderIcon class="icon" />
                        <h2>Download</h2>
                    </div>
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.music">
                        <FolderIcon class="icon" />
                        <h2>Music</h2>
                    </div>
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.pictures">
                        <FolderIcon class="icon" />
                        <h2>Pictures</h2>
                    </div>
                    <div v-focus class="item sfx-nav-handler sfx-activation-handler"
                        @sn:enter-down="currentDir = places.videos">
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
                <div class="files">
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
                        <div v-focus
                            @sn:enter-down="() => sortingMode = sortingMode == 'smallest' ? 'biggest' : 'smallest'"
                            class="group  sfx-nav-handler sfx-activation-handler">
                            <h2>Size</h2>
                            <ArrowUpIcon v-if="sortingMode == 'smallest'" class="icon" />
                            <ArrowDownIcon v-if="sortingMode == 'biggest'" class="icon" />
                        </div>
                    </div>

                    <div class="scroll-container" ref="filesScrollClip">
                        <div v-focus-section:entries-list class="item-container">
                            <div v-for="(entry, index) in dirEntriesSorted" v-focus
                                class="item sfx-nav-handler sfx-activation-handler" @sn:enter-down="() => {
                                    if (entry.is_dir) currentDir += `/${entry.name}`
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
            </div>

            <div class="buttons-container">
                <div v-focus
                    @sn:enter-down="() => { callback(`${currentDir}/${dirEntriesSorted[currentEntrySelected].name}`); emit('modal-close'); }"
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

.icon-holder {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;
}

.icon {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;

    box-sizing: border-box;
    padding: v-bind(scale(2));
}

.top-bar {
    display: flex;
    align-items: center;
    margin-bottom: v-bind(scale(10));
    gap: v-bind(scale(50));

    flex-shrink: 0;

    height: v-bind(scale(65));

    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;

    padding: 0 v-bind(scale(40));

    & .group {
        display: flex;
        align-items: center;
        gap: v-bind(scale(25));
    }
}

.main-content-container {
    width: 100%;
    height: 100%;
    display: flex;

    flex: 1;

    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;

    & .quick-places {
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

    & .files {
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
                    padding: v-bind(scale(5));
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
                height: v-bind(45);
                display: flex;

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