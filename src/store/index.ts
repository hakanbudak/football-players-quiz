import { createStore } from 'vuex';

export default createStore({
    state: {
        selectedLeague: null,
        mode: 'easy',
        player: null,
    },
    mutations: {
        setLeague(state, league) {
            state.selectedLeague = league;
        },
        setMode(state, mode) {
            state.mode = mode;
        },
        setPlayer(state, player) {
            state.player = player;
        },
    },
    actions: {
        selectLeague({ commit }, league) {
            commit('setLeague', league);
        },
        selectMode({ commit }, mode) {
            commit('setMode', mode);
        },
        setPlayer({ commit }, player) {
            commit('setPlayer', player);
        },
    },
    getters: {
        selectedLeague: (state) => state.selectedLeague,
        mode: (state) => state.mode,
        player: (state) => state.player,
    },
});
