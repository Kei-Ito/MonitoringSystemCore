import { defineStore } from 'pinia'

import { loadLocalStorage, saveLocalStorage } from './localStorage'

/**
 * 配列かどうかを判定し、配列でない場合は配列に変換する関数
 * @param v オブジェクト（配列または単一の値）
 * @returns 配列
 */
function toArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}

export const useUiStore = defineStore('uiStore', {
    state: () => ({
        color: loadLocalStorage('color') || 'info',
        /** Dark Modeにするかどうかのフラグ */
        isDarkMode: false,
        sidebarType: 'bg-gradient-dark',
        showSidenav: true,
        showNavbar: true,
        showMain: true,
        showFooter: true,
        hideConfigButton: false,
        isPinned: true,
        isRTL: false,
        isNavFixed: false,
        isAbsolute: false,
        showConfig: false,
        isAdmin: false,
        isLayoutEditMode: false,
        dashboardViewCategory1Selected: ["a","b","c"],// TODO: 将来的にlocalStorageに保存する
        dashboardViewCategory2Selected: ["d","e","f"],// TODO: 将来的にlocalStorageに保存する
        trendViewCategory1Selected: ["a"],// TODO: 将来的にlocalStorageに保存する
        trendViewCategory2Selected: ["d"],// TODO: 将来的にlocalStorageに保存する
        // 編集モード切り替え時の一時保存用
        savedDashboardCategory1: [] as string[],
        savedDashboardCategory2: [] as string[],
        savedTrendCategory1: [] as string[],
        savedTrendCategory2: [] as string[],
        category1List: ["a"],
        category2List: ["d"],
        navbarFixed:
            "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
        absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
    }),
    actions: {
        toggleConfigurator() { this.showConfig = !this.showConfig },
        navbarMinimize() {
            
            const el = document.querySelector('.g-sidenav-show');
            if (!el) return;

            const pinned = el.classList.contains('g-sidenav-pinned');
            if (pinned) {
                el.classList.remove('g-sidenav-pinned');
                this.isPinned = false;
            } else {
                el.classList.add('g-sidenav-pinned');
                this.isPinned = true;
            }
        },
        navbarFixed() {
            this.isNavFixed = !this.isNavFixed;
        },
        //** サインインページなどでサイドバーやフッター、ナビゲーションバーを非表示にするためのイベント */
        toggleEveryDisplay() {
            this.showNavbar = !this.showNavbar;
            this.showSidenav = !this.showSidenav;
            this.showFooter = !this.showFooter;
        },
        toggleHideConfig() {
            this.hideConfigButton = !this.hideConfigButton;
        },
        toggleSidebar() { this.showSidenav = !this.showSidenav },
        toggleLayoutEditMode() {
            this.isLayoutEditMode = !this.isLayoutEditMode;
            
            if (this.isLayoutEditMode) {
                // 編集モード開始: 現在のフィルタを保存して全表示('All')にする
                this.savedDashboardCategory1 = [...this.dashboardViewCategory1Selected];
                this.savedDashboardCategory2 = [...this.dashboardViewCategory2Selected];
                this.savedTrendCategory1 = [...this.trendViewCategory1Selected];
                this.savedTrendCategory2 = [...this.trendViewCategory2Selected];

                this.dashboardViewCategory1Selected = ['All'];
                this.dashboardViewCategory2Selected = ['All'];
                this.trendViewCategory1Selected = ['All'];
                this.trendViewCategory2Selected = ['All'];
            } else {
                // 編集モード終了: 保存していたフィルタを復元する
                this.dashboardViewCategory1Selected = [...this.savedDashboardCategory1];
                this.dashboardViewCategory2Selected = [...this.savedDashboardCategory2];
                this.trendViewCategory1Selected = [...this.savedTrendCategory1];
                this.trendViewCategory2Selected = [...this.savedTrendCategory2];
            }
        },
        /** ローカルストレージに保存するのでstoreで管理している */
        setColor(c: string) { saveLocalStorage('color',c); this.color = c },
        setCategory1Selected(selectedCategory1: string[],currentRouteName:string) {
            if (currentRouteName === 'Dashboard') {
                this.dashboardViewCategory1Selected = toArray(selectedCategory1);
            } else if (currentRouteName === 'Trend') {
                this.trendViewCategory1Selected =  toArray(selectedCategory1);
            }
        },
        setCategory2Selected(selectedCategory2: string[],currentRouteName:string) {
            if (currentRouteName === 'Dashboard') {
                this.dashboardViewCategory2Selected = toArray(selectedCategory2);
            } else if (currentRouteName === 'Trend') {
                this.trendViewCategory2Selected = toArray(selectedCategory2);
            }
        },
    },
})
