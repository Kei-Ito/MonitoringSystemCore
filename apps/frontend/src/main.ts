import { createApp } from "vue";
import {createPinia} from 'pinia';
import Toast, { TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import router from "@/router";
import i18n from "@/i18n.ts";
import "@/assets/css/nucleo-icons.css";
import "@/assets/css/nucleo-svg.css";
import "@/assets/css/Material-Icons.css";
import MaterialDashboard from "@/material-dashboard.ts";


const options = {
    toastDefaults: {
        // ToastOptions object for each type of toast
        [TYPE.ERROR]: {
            timeout: false,
        },
        [TYPE.SUCCESS]: {
            timeout: 2000,
            hideProgressBar: true,
        }    
    }
};


const appInstance = createApp(App);
appInstance.use(createPinia());
appInstance.use(router);
appInstance.use(i18n);
appInstance.use(MaterialDashboard);
appInstance.use(Toast, options);
appInstance.mount("#app");
