import { invoke } from "@tauri-apps/api/core";
import { computedAsync } from "@vueuse/core";
import path from "path-browserify";
import { computed, Ref, ref } from "vue";

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

export const directoryGoUp = () => {
    const parent = path.dirname(currentDir.value);
    if (parent !== currentDir.value) {
        currentDir.value = parent;
    }
}

export const sortingMode = ref<SortingMode>("a-z");

// Path must always be normalized and absolute
export const currentDir = ref('');
export const currentDirTidy = computed(() => {
    const pathEntries = currentDir.value.split('/').filter(Boolean);
    for (let i = pathEntries.length; i >= 1; i--) {
        const joined = pathEntries.slice(-i).join(' > ');
        if (joined.length <= 60) return joined.replaceAll(' > ', '<span class="gray"> > </span>');
    }
    return pathEntries.pop();
})

export const currentDirEntries = computedAsync(async () => {
    try {
        let result = await invoke<DirEntry[]>('get_dir_entries', { directory: currentDir.value + "/" });
        return result;
    } catch (err) {
        console.error(err)
    }
}, []);
export const dirEntriesSorted = computed(() => sortEntries(sortingMode.value, currentDirEntries.value));
/*   /\
     |   */
export const currentEntrySelected = ref<number>();


export const places = computedAsync(async () => {
    let result = await invoke<Places>('get_fs_places');
    result.volumes.map((v) => {
        if (!v.name) {
            v.name = v.mount_point;
        }
        return v;
    });
    currentDir.value = result.volumes[0].mount_point
    return result;
});

let resolvePromise: ((path: string | null) => void) | null = null;
let close: () => void;

export function useExplorerModal(showHandle: Ref<boolean>, closeCb: () => void): Promise<string | null> {
    close = closeCb;
    showHandle.value = true;

    return new Promise((resolve) => {
        resolvePromise = resolve;
    });
}

export function resolveExplorerModal(path: string | null) {
    close();
    resolvePromise?.(path);
    resolvePromise = null;
}