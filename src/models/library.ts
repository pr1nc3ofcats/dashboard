import dayjs from "dayjs";
import { Application } from "./application";

export class Library {
    private static instance: Library;
    private applications: Application[] = [];

    public static async init() {
        if (!this.instance) {
            this.instance = new Library;
            for (let i = 0; i < 5; i++) {
                if (i % 2 !== 0) {
                    this.instance.applications.push({
                        id: i,
                        title: "Minecraft",
                        command: ["whoami"],
                        imgSquare: "C:/Users/ZloyKot/Desktop/assets/minecraft.webp",
                        lastLaunched: dayjs().add(i, "minute").toDate(),
                        isGame: true,

                        steamDetails: {
                            imgBackground: "C:/Users/ZloyKot/Desktop/assets/minecraft-cover.jpg"
                        }
                    });
                } else {
                    this.instance.applications.push({
                        id: i,
                        title: "Nine Sols",
                        command: ["whoami"],
                        imgSquare: "C:/Users/ZloyKot/Desktop/assets/nine sols.webp",
                        lastLaunched: dayjs().add(i, "minute").toDate(),
                        isGame: true,

                        steamDetails: {
                            imgBackground: "C:/Users/ZloyKot/Desktop/assets/nine-sols-16-9.webp"
                        }
                    });
                }
            }
            // this.instance.applications = await invoke('parse_library');
        }
    }

    public static get(id: number) {
        for (let app of this.instance.applications) {
            if (app.id === id) return app
        }
        return undefined;
    }

    public static getAll(sort: "last_launch" | "a-z" | "z-a"): Application[] {
        if (sort === "last_launch") return this.instance.applications.toSorted((a, b) => b.lastLaunched.getTime() - a.lastLaunched.getTime())
        else if (sort === "a-z") return this.instance.applications.toSorted((a, b) => a.title.localeCompare(b.title))
        else return this.instance.applications.toSorted((a, b) => b.title.localeCompare(a.title))
    }
}