import { defineStore } from 'pinia'
import { loadLocalStorageColor, saveLocalStorageColor } from './localStorageColor'

export const useUiStore = defineStore('uiStore', {
    state: () => ({
        color: loadLocalStorageColor(),
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
        navbarFixed:
            "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
        absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
    }),
    actions: {
        toggleConfigurator() { this.showConfig = !this.showConfig },
        navbarMinimize() {
            const el = document.querySelector('.g-sidenav-show');
            if (!el) return;
            el.classList.toggle('g-sidenav-pinned');
            this.isPinned = !this.isPinned;
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
        setColor(c: string) { saveLocalStorageColor(c); this.color = c },
    },
})
