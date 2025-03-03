import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSignOutAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Tambahkan ikon ke library FontAwesome
library.add(faSignOutAlt, faArrowRight);

// Registrasi komponen FontAwesome secara global di Vue
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");


library.add(faSignOutAlt, faArrowRight);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)

app.mount('#app')
