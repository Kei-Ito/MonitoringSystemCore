import "vue-toastification/dist/index.css";
import "@/assets/css/nucleo-icons.css";
import "@/assets/css/nucleo-svg.css";
import "@/assets/css/Material-Icons.css";
import "@/assets/css/global-style.css";
import "vue-multiselect/dist/vue-multiselect.css";

import {createPinia} from 'pinia';
import { createApp } from "vue";
import Toast, { TYPE } from "vue-toastification";

import i18n from "@/i18n.ts";
import MaterialDashboard from "@/material-dashboard.ts";
import router from "@/router";

import App from "./App.vue";


const options = {
    toastDefaults: {
        // ToastOptions object for each type of toast
        [TYPE.ERROR]: {
            timeout: false,
        },
        [TYPE.SUCCESS]: {
            timeout: 2000,
            hideProgressBar: true,
        },
        [TYPE.WARNING]: {
            timeout: false,
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
