import { createStore } from "vuex";
import systemSetting from "./systemSetting";

export default createStore({
  modules: {
    systemSetting:{
      ...systemSetting,
      namespaced: false,
    }
  },
});