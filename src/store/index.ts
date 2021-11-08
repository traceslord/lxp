import Vue from "vue";
import Vuex from "vuex";
import { state, State } from "./state";

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters: {},
  mutations: {
    getUserPhone(state: State, userPhone: string): void {
      state.userPhone = userPhone;
    },
    getUserName(state: State, userName: string): void {
      state.userName = userName;
    },
    getUserAvatar(state: State, userAvatar: string): void {
      state.userAvatar = userAvatar;
    },
    getPermissions(state: State, authPermissions: string[]): void {
      state.authPermissions = authPermissions;
    },
  },
  actions: {},
});

export default store;
