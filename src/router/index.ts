import { createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Library from "../views/Library.vue";

const router = createRouter({
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
        },
        {
            path: "/library",
            name: "library",
            component: Library,
        }
    ],

    history: createWebHistory(import.meta.env.BASE_URL)
});

export default router;