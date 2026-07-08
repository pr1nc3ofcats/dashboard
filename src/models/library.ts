import { Application } from "./application";

export class Library {
    private static instance: Library;
    private applications: Map<number, Application> = new Map;

    public static async init() {
        if (!this.instance) {
            this.instance = new Library;
            for (let i = 0; i < 9; i++) {
                if (i % 2 !== 0) {
                    this.instance.applications.set(i, {
                        title: "Minecraft",
                        command: ["whoami"],
                        imgSquare: "library/1/resources/minecraft.webp",
                        logo: "library/1/resources/minecraft-logo.png",

                        steamDetails: {
                            imgBackground: "library/1/resources/minecraft-cover.jpg"
                        }
                    });
                } else {
                    this.instance.applications.set(i, {
                        title: "Nine Sols",
                        command: ["whoami"],
                        imgSquare: "library/0/resources/nine sols.webp",
                        logo: "library/0/resources/nine sols logo.webp",

                        steamDetails: {
                            imgBackground: "library/0/resources/nine-sols-16-9.webp"
                        }
                    });
                }
            }
            // this.instance.applications = await invoke('parse_library');
        }
    }

    public static get<K extends keyof Application>(id: number, prop: K) {
        return this.instance.applications.get(id)?.[prop]
    }
}