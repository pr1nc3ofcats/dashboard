import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";
import './styles/fonts.css';
import vueSpatialNavigation from "vue-spatial-nav";
import { Settings } from "./models/settings.ts";
import { Library } from "./models/library.ts";

await Settings.init();
await Library.init();

const app = createApp(App)
app.use(vueSpatialNavigation, {})
app.use(router);
app.mount("#app");
