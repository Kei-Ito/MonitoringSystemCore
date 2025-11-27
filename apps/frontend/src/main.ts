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
    maxToasts: 5,
    newestOnTop: true,
    filterBeforeCreate: (toast: any, toasts: any) => {
        // 既存のトーストの中から、同じメッセージを持つものを探す
        const existingToast = toasts.find((t: any) => {
            if (t.content === toast.content) return true;
            if (typeof t.content === 'string' && typeof toast.content === 'string') {
                // 末尾の (xN) を除外して比較
                const baseContent = t.content.replace(/ \(x\d+\)$/, '');
                return baseContent === toast.content;
            }
            return false;
        });

        if (existingToast) {
            // カウントを取得
            let count = 1;
            if (typeof existingToast.content === 'string') {
                const match = existingToast.content.match(/\(x(\d+)\)$/);
                if (match) {
                    count = parseInt(match[1], 10);
                }
            }
            
            // コンテンツを更新
            existingToast.content = `${toast.content} (x${count + 1})`;
            
            // 新規作成はキャンセル
            return false;
        }
        return toast;
    },
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
