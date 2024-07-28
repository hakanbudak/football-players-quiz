import { createStore } from 'vuex';

export default createStore({
    state: {
        selectedLeague: null,
        mode: 'easy',
        player: null,
        playerTransfers: [],
        playerProfile: null,
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
        setPlayerTransfers(state, transfers) {
            state.playerTransfers = transfers;
        },
        setPlayerProfile(state, profile) {
            state.playerProfile = profile;
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
        setPlayerTransfers({ commit }, transfers) {
            commit('setPlayerTransfers', transfers);
        },
        setPlayerProfile({ commit }, profile) {
            commit('setPlayerProfile', profile);
        },
    },
    getters: {
        selectedLeague: (state) => state.selectedLeague,
        mode: (state) => state.mode,
        player: (state) => state.player,
        playerTransfers: (state) => state.playerTransfers,
        playerProfile: (state) => state.playerProfile,
    },
});
