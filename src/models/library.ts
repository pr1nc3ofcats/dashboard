import { Application } from "./application";
import { reactive } from "vue";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";

type SortingMode = "last_launch" | "a-z" | "z-a";

export class Library {
    private static applications: Application[] = reactive([]);

    public static async init() {
        this.applications = await invoke('parse_applications');
        // In runtime this property becomes a string 
        for (let app of this.applications) {
            app.lastLaunched = app.lastLaunched ? new Date(app.lastLaunched) : undefined;
        }
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
        invoke('try_spawn_detached', { cmd: cmd }).then(() =>
            this.set(id, "lastLaunched", dayjs().toDate())).catch((err) =>
                console.error("Error while spawning process: ", err));
    }

    private static sort(arr: Application[], sort: "last_launch" | "a-z" | "z-a"): Application[] {
        if (sort === "last_launch") return arr.toSorted((a, b) => (b.lastLaunched?.getTime() ?? 0) - (a.lastLaunched?.getTime() ?? 0))
        else if (sort === "a-z") return arr.toSorted((a, b) => a.title.localeCompare(b.title))
        else return arr.toSorted((a, b) => b.title.localeCompare(a.title))
    }
}