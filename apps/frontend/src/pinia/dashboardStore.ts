import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboardStore', {
    state: () => ({
        dashboardLayout: {
        user_uuid: '',
        charts: [],
        },
    }),
    actions: {

    },
    });