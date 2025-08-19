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
        isDarkMode: false,
        sidebarType: 'bg-gradient-dark',
        showSidenav: true,
        showNavbar: true,
        showNavs: true,
        showMain: true,
        showFooter: true,
        hideConfigButton: false,
        isPinned: true,
        isRTL: false,
        isNavFixed: false,
        isAbsolute: false,
        showConfig: false,
        isAdmin: true,
        dashboardViewCategory1Selected: ["a","b","c"],// TODO: 将来的にlocalStorageに保存する
        dashboardViewCategory2Selected: ["d","e","f"],// TODO: 将来的にlocalStorageに保存する
        trendViewCategory1Selected: ["a"],// TODO: 将来的にlocalStorageに保存する
        trendViewCategory2Selected: ["d"],// TODO: 将来的にlocalStorageに保存する
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
