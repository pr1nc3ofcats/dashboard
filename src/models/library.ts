import dayjs from "dayjs";
import { Application } from "./application";
import { reactive } from "vue";

type SortingMode = "last_launch" | "a-z" | "z-a";

export class Library {
    private static applications: Application[] = reactive([]);

    public static async init() {
        this.applications.push({
            id: 124,
            title: "Nine Sols",
            command: ["whoami"],
            imgSquare: "C:/Users/ZloyKot/Desktop/assets/nine sols.webp",
            lastLaunched: dayjs().toDate(),
            categories: ["Games", "Metroidvanias"],

            steamDetails: {
                imgBackground: "C:/Users/ZloyKot/Desktop/assets/nine-sols-16-9.webp"
            }
        });
        this.applications.push({
            id: 12,
            title: "Minecraft",
            command: ["whoami"],
            imgSquare: "C:/Users/ZloyKot/Desktop/assets/minecraft.webp",
            lastLaunched: dayjs().toDate(),
            categories: ["Games"],

            steamDetails: {
                imgBackground: "C:/Users/ZloyKot/Desktop/assets/minecraft-cover.jpg"
            }
        });
        this.applications.push({
            id: 890,
            title: "YouTube",
            command: ["whoami"],
            imgSquare: "C:/Users/ZloyKot/Desktop/assets/youtube-logo.jpeg",
            lastLaunched: dayjs().toDate(),
            categories: ["Applications"],
        })
        // this.instance.applications = await invoke('parse_library');
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

    private static sort(arr: Application[], sort: "last_launch" | "a-z" | "z-a"): Application[] {
        if (sort === "last_launch") return arr.toSorted((a, b) => b.lastLaunched.getTime() - a.lastLaunched.getTime())
        else if (sort === "a-z") return arr.toSorted((a, b) => a.title.localeCompare(b.title))
        else return arr.toSorted((a, b) => b.title.localeCompare(a.title))
    }
}