import { Application } from "../types/application";
import { reactive, watch, WatchCallback } from "vue";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";

type SortingMode = "last_launch" | "a-z" | "z-a";

export class Library {
    private static applications: Application[] = reactive([]);

    public static watch(f: WatchCallback, immediate: boolean = false) {
        return watch(this.applications, f, { immediate: immediate })
    }

    public static async init() {
        Object.assign(this.applications, await invoke<Application[]>("parse_applications"));
        
        // In runtime this property becomes a string 
        for (let app of this.applications) {
            app.last_launched = app.last_launched ? new Date(app.last_launched) : undefined;
        }
    }

    public static add(app: Application) {
        this.applications.push(app);
        invoke('dump_applications', { apps: this.applications }).catch((err) => console.error(err));
    }

    public static set<K extends keyof Application, V extends Application[K]>(id: number, property: K, value: V) {
        for (let app of this.applications) {
            if (app.id === id) {
                app[property] = value;
                invoke('dump_applications', { apps: this.applications }).catch((err) => console.error(err));
            }
        }
    }

    public static get(id: number) {
        for (let app of this.applications) {
            if (app.id === id) return app
        }
        return undefined;
    }

    public static getAll(sort: SortingMode): Application[] {
        return this.sort(this.applications, sort);
    }

    public static getAllFromCategory(category: string, sort: SortingMode) {
        const filtered = this.applications.filter((el) => el.categories.includes(category));
        return this.sort(filtered, sort);
    }

    public static getAllCategories(): string[] {
        let result: string[] = ["Games", "Applications"];
        for (let app of this.applications) {
            result = result.concat(app.categories)
        }
        return Array.from(new Set(result));
    }

    public static tryLaunch(id: number) {
        const cmd = this.get(id)?.command;
        const working_dir = this.get(id)?.data_path;
        invoke('try_focuse_window', { cmd: cmd }).catch((err) => {
            if (err === "process is not running") {
                invoke('try_spawn_detached', { cmd: cmd, working_dir: working_dir}).then(() =>
                    this.set(id, 'last_launched', dayjs().toDate())).catch((err) =>
                        console.error("Error while spawning process: ", err));
            } else {
                console.error(err);
            }
        })
    }

    private static sort(arr: Application[], sort: "last_launch" | "a-z" | "z-a"): Application[] {
        if (sort === "last_launch") return arr.toSorted((a, b) => (b.last_launched?.getTime() ?? 0) - (a.last_launched?.getTime() ?? 0))
        else if (sort === "a-z") return arr.toSorted((a, b) => a.title.localeCompare(b.title))
        else return arr.toSorted((a, b) => b.title.localeCompare(a.title))
    }
}